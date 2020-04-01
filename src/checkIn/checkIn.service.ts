import { evolve, map, pick, pipe } from 'ramda'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { IGuestRepository } from '../guest/guest.repository'
import { IMailService } from '../mail/mail.service'
import { ReservationDetail } from '../reservation/reservation.interface'
import { IReservationRepository } from '../reservation/reservation.repository'
import { randomNumString, renameKeys } from '../utils'
import { OtpReference } from './checkIn.interface'

export interface ICheckInService {
    getReservationForCheckIn(
        nationalID: string,
        checkIn: Date
    ): Promise<ReservationDetail>
    generateOtp(reservationID: string): Promise<OtpReference>
}

export class CheckInService implements ICheckInService {
    reservationRepository: IReservationRepository
    guestRepository: IGuestRepository
    mailService: IMailService
    constructor({
        reservationRepository,
        guestRepository,
        mailService
    }: Dependencies<IReservationRepository | IGuestRepository | IMailService>) {
        this.reservationRepository = reservationRepository
        this.guestRepository = guestRepository
        this.mailService = mailService
    }
    async getReservationForCheckIn(nationalID: string, checkIn: Date) {
        const guest = await this.guestRepository.findOneByNationalId(nationalID)
        if (!guest) {
            throw new BadRequestError('User not found.')
        }
        const reservation = await this.reservationRepository.getGuestReservation(
            guest.id,
            checkIn
        )
        if (!reservation) {
            throw new BadRequestError('Reservation not found.')
        }
        return pipe(
            pick(['id', 'check_in', 'check_out', 'special_requests', 'rooms']),
            evolve({
                rooms: map(evolve({ beds: i => i.length }))
            }),
            renameKeys({
                check_in: 'checkIn',
                check_out: 'checkOut',
                special_requests: 'specialRequests',
                transaction: 'isPaid'
            })
        )(reservation) as ReservationDetail
    }
    async generateOtp(reservationID: string) {
        const password = randomNumString(6)
        const referenceCode = randomNumString(4)
        await this.reservationRepository.createOtp(
            reservationID,
            password,
            referenceCode
        )
        const guest = await this.reservationRepository.getReservationOwner(
            reservationID
        )
        await this.mailService.sendMail({
            text: `Your OTP is ${password}. Reference Code: ${referenceCode}`,
            to: guest.email,
            subject: 'Hilbert Check In OTP'
        })
        return { referenceCode }
    }
}
