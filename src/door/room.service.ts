import moment from 'moment'
import { concat } from 'ramda'
import { Dependencies } from '../container'
import { BadRequestError, ForbiddenError } from '../error/HttpError'
import { IMailService } from '../mail/mail.service'
import { GuestReservationRoom } from '../models/guest_reservation_room'
import { IReservationRepository } from '../reservation/reservation.repository'
import { RoomPayload } from './room.interface'
import { IRoomRepository } from './room.repository'

export interface IRoomService {
    shareRoom(
        ownerID: string,
        email: string,
        reservationID: string,
        roomID: number
    ): Promise<GuestReservationRoom>
    notifyShareRoom(
        reservationID: string,
        email: string,
        roomID: number
    ): Promise<void>
    findRoomsThatCanEnter(
        guestID: string,
        email: string,
        date: Date
    ): Promise<RoomPayload>
    hasPermissionToEnterRoom(
        guestID: string,
        email: string,
        date: Date,
        roomID: number
    ): Promise<boolean>
}

export class RoomService implements IRoomService {
    roomRepository: IRoomRepository
    reservationRepository: IReservationRepository
    mailService: IMailService
    constructor({
        roomRepository,
        reservationRepository,
        mailService
    }: Dependencies<IRoomRepository | IReservationRepository | IMailService>) {
        this.roomRepository = roomRepository
        this.reservationRepository = reservationRepository
        this.mailService = mailService
    }
    async shareRoom(
        ownerID: string,
        email: string,
        reservationID: string,
        roomID: number
    ) {
        const isOwner = await this.checkIsReservationOwner(
            ownerID,
            reservationID
        )
        if (!isOwner) {
            throw new ForbiddenError(
                'Can not share room. You did not make this reservation.'
            )
        }
        const rooms = await this.roomRepository.findRoomsInReservation(
            reservationID
        )
        if (!rooms.some(r => r.id === roomID)) {
            throw new BadRequestError('This room is not in this reservation')
        }
        const check = await this.roomRepository.findGuestRoomReservation(
            email,
            reservationID
        )
        if (check) {
            if (check.room_id === roomID) {
                throw new BadRequestError(
                    'You already shared this room to this email.'
                )
            } else {
                throw new BadRequestError(
                    'This email already has access to a room.'
                )
            }
        }
        try {
            const result = await this.roomRepository.createGuestRoomReservation(
                email,
                reservationID,
                roomID
            )
            await this.notifyShareRoom(reservationID, email, roomID)
            return result
        } catch (e) {
            if (e.name === 'UniqueViolationError') {
                throw new BadRequestError(
                    'You already shared this room to this email.'
                )
            } else {
                throw e
            }
        }
    }
    async notifyShareRoom(
        reservationID: string,
        email: string,
        roomID: number
    ) {
        const reservation = await this.roomRepository.findReservationWithOwner(
            reservationID
        )
        const { guest } = reservation
        const owner = `${guest?.firstname} ${guest?.lastname}`
        const cin = moment(reservation.check_in).format('dddd, MMMM Do YYYY')
        const cout = moment(reservation.check_out).format('dddd, MMMM Do YYYY')
        const message = `${owner} shared a room with you. You can access room ${roomID}.
This key is valid from ${cin} until ${cout}.
Go to https://booking.hilbert.now.sh and log in to get your key.
If you do not have an account, please register using this email.`
        return this.mailService.sendMail({
            to: email,
            subject: 'Hilbert Room Access Key',
            text: message
        })
    }
    async checkIsReservationOwner(guestID: string, reservationID: string) {
        const reservation = await this.roomRepository.findReservationById(
            reservationID
        )
        if (!reservation) {
            throw new BadRequestError('Invalid reservation id.')
        }
        return reservation.guest_id === guestID
    }

    async findRoomsThatCanEnter(guestID: string, email: string, date: Date) {
        const reservation = await this.roomRepository.findReservationIn(
            guestID,
            email,
            date
        )
        if (!reservation) {
            throw new BadRequestError('Not checked in.')
        }
        const isOwner = reservation.guest_id === guestID

        const rooms = isOwner
            ? await this.allRoomsInReservation(reservation.id)
            : await this.roomShared(email, reservation.id).then(room =>
                  room ? [room] : []
              )
        return {
            rooms,
            reservationID: reservation.id
        }
    }

    async allRoomsInReservation(reservationID: string) {
        const reservation = await this.reservationRepository.getReservationWithRoom(
            reservationID
        )
        const { rooms, followers } = reservation
        const followersRoomMap = followers.reduce((acc, cur) => {
            const { room_id, guest_email } = cur
            return {
                ...acc,
                [room_id]: concat(acc[room_id] ?? [], [guest_email])
            }
        }, {} as { [key: number]: string[] })
        return rooms.map(room => {
            return {
                ...room,
                followers: followersRoomMap[room.id] ?? []
            }
        })
    }

    async roomShared(email: string, reservationID: string) {
        const shared = await this.roomRepository.findGuestRoomReservation(
            email,
            reservationID
        )
        return shared?.room
    }

    async hasPermissionToEnterRoom(
        guestID: string,
        email: string,
        date: Date,
        roomID: number
    ) {
        const reservation = await this.roomRepository.findReservationIn(
            guestID,
            email,
            date
        )
        if (!reservation) {
            throw new BadRequestError('Not checked in.')
        }
        if (reservation.guest_id === guestID) {
            const rooms = await this.allRoomsInReservation(reservation.id)
            return rooms.some(r => r.id === roomID)
        }
        const room = await this.roomShared(email, reservation.id)
        return room?.id === roomID
    }
}
