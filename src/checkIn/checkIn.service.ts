import { evolve, map, pick, pipe } from 'ramda'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { IFileService } from '../files/file.service'
import { IGuestRepository } from '../guest/guest.repository'
import { IMailService } from '../mail/mail.service'
import { ReservationDetail } from '../reservation/reservation.interface'
import { randomNumString, renameKeys } from '../utils'
import { OtpReference } from './checkIn.interface'
import { ICheckInRepository } from './checkIn.repository'

export interface ICheckInService {
    getReservationForCheckIn(
        nationalID: string,
        checkIn: Date
    ): Promise<ReservationDetail>
    generateOtp(reservationID: string): Promise<OtpReference>
    verifyOtp(reservationID: string, password: string): Promise<boolean>
    addCheckInRecord(
        reservationID: string,
        kioskPhoto: any,
        idCardPhoto: any,
        idCardDetail: any
    ): Promise<string>
}

export class CheckInService implements ICheckInService {
    checkInRepository: ICheckInRepository
    guestRepository: IGuestRepository
    mailService: IMailService
    fileService: IFileService
    constructor({
        checkInRepository,
        guestRepository,
        mailService,
        fileService
    }: Dependencies<
        ICheckInRepository | IGuestRepository | IMailService | IFileService
    >) {
        this.checkInRepository = checkInRepository
        this.guestRepository = guestRepository
        this.mailService = mailService
        this.fileService = fileService
    }
    async getReservationForCheckIn(nationalID: string, checkIn: Date) {
        const guest = await this.guestRepository.findOneByNationalId(nationalID)
        if (!guest) {
            throw new BadRequestError('User not found.')
        }
        const reservation = await this.checkInRepository.getGuestReservation(
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
        await this.checkInRepository.createOtp(
            reservationID,
            password,
            referenceCode
        )
        const guest = await this.checkInRepository.getReservationOwner(
            reservationID
        )
        await this.mailService.sendMail({
            text: `Your OTP is ${password}. Reference Code: ${referenceCode}`,
            to: guest.email,
            subject: 'Hilbert Check In OTP'
        })
        return { referenceCode }
    }
    async verifyOtp(reservationID: string, password: string) {
        const otp = await this.checkInRepository.getReservationOtp(
            reservationID
        )
        if (!otp) {
            throw new BadRequestError('Reservation not found.')
        }
        return otp.password === password
    }
    async addCheckInRecord(
        reservationID: string,
        kioskPhoto: any,
        idCardPhoto: any,
        idCardDetail: any
    ) {
        const kioskPhotoUrl = await this.fileService.uploadFiles(kioskPhoto)
        const idCardPhotoUrl = await this.fileService.uploadFiles(idCardPhoto)
        const record = await this.checkInRepository.createReservationRecord(
            reservationID,
            kioskPhotoUrl,
            { ...idCardDetail, idCardPhoto: idCardPhotoUrl }
        )
        await this.checkInRepository.addCheckInTime(reservationID, new Date())
        return 'success'
    }
}
