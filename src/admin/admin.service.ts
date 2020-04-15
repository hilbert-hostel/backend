import { compare, hash } from 'bcryptjs'
import moment from 'moment'
import { append, evolve, map, omit, pick, pipe } from 'ramda'
import { GuestDetails, LoginInput } from '../auth/auth.interface'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { getGuestDetails } from '../guest/guest.utils'
import { Bed } from '../models/bed'
import { renameKeys } from '../utils'
import {
    AdminRoomSearch,
    CheckInInfo,
    CheckInOutSummary,
    CheckOutInfo,
    CreateStaff,
    ReservationInfo,
    StaffDetails
} from './admin.interface'
import { IAdminRespository } from './admin.repository'

export interface IAdminService {
    listReservations(from: Date, to: Date): Promise<ReservationInfo[]>
    registerStaff(data: CreateStaff): Promise<StaffDetails>
    loginStaff(data: LoginInput): Promise<StaffDetails>
    listGuests(page: number, size: number): Promise<GuestDetails[]>
    listCheckInCheckOut(page: number, size: number): Promise<CheckInOutSummary>
    getAllRooms(): Promise<AdminRoomSearch[]>
}
export const stayDuration = (checkIn: Date, checkOut: Date) =>
    moment(checkOut).diff(moment(checkIn), 'days')
export class AdminService implements IAdminService {
    adminRepository: IAdminRespository
    constructor({ adminRepository }: Dependencies<IAdminRespository>) {
        this.adminRepository = adminRepository
    }
    async listReservations(from: Date, to: Date) {
        const reservations = await this.adminRepository.listReservations(
            from,
            to
        )
        return map(
            pipe(
                pick([
                    'id',
                    'check_in',
                    'check_out',
                    'rooms',
                    'guest',
                    'special_requests'
                ]),
                evolve({
                    guest: getGuestDetails
                }),
                renameKeys({
                    check_in: 'checkIn',
                    check_out: 'checkOut',
                    special_requests: 'specialRequests'
                })
            )
        )(reservations) as ReservationInfo[]
    }

    async registerStaff(input: CreateStaff) {
        const hashed = await hash(input.password, 10)
        const staff = await this.adminRepository.createStaff({
            ...input,
            password: hashed
        })
        return omit(['password'], staff)
    }

    async loginStaff(input: LoginInput) {
        const staff = await this.adminRepository.findStaff({
            email: input.email
        })
        if (!staff) throw new BadRequestError('Wrong email or password.')
        const correct = await compare(input.password, staff.password)
        if (!correct) throw new BadRequestError('Wrong email or password.')
        return omit(['password'], staff)
    }
    async listGuests(page: number = 0, size: number = 25) {
        const guests = await this.adminRepository.listGuests(page, size)
        return map(getGuestDetails)(guests) as GuestDetails[]
    }

    async listCheckInCheckOut(page: number = 0, size: number = 25) {
        const [checkIn, checkOut] = await Promise.all([
            this.adminRepository.listCheckIns(page, size).then(
                map(
                    (r): CheckInInfo => {
                        const {
                            check_in,
                            check_out,
                            check_in_enter_time,
                            id,
                            guest
                        } = r
                        const nights = stayDuration(check_in, check_out)
                        const beds = r.beds!.length
                        return {
                            id,
                            beds,
                            nights,
                            guest: getGuestDetails(guest),
                            checkInTime: check_in_enter_time
                        } as CheckInInfo
                    }
                )
            ),
            this.adminRepository.listCheckOuts(page, size).then(
                map(
                    (r): CheckOutInfo => {
                        const {
                            check_in,
                            check_out,
                            check_out_exit_time,
                            id,
                            guest
                        } = r
                        const nights = stayDuration(check_in, check_out)
                        const beds = r.beds!.length
                        return {
                            id,
                            beds,
                            nights,
                            guest: getGuestDetails(guest),
                            checkOutTime: check_out_exit_time
                        } as CheckOutInfo
                    }
                )
            )
        ])
        return {
            checkIn,
            checkOut
        }
    }
    async getAllRooms() {
        const rooms = await this.adminRepository.getAllRooms()
        const roomsByType = rooms.reduce((acc, cur) => {
            const { type, id, beds, ...rest } = cur
            const old = acc[type] ?? { ...rest, rooms: [] }
            return {
                ...acc,
                [type]: {
                    ...old,
                    rooms: append({ id, beds: beds as Bed[] }, old.rooms)
                }
            }
        }, {} as { [key: string]: Omit<AdminRoomSearch, 'type'> })
        const result: AdminRoomSearch[] = []
        for (const type in roomsByType) {
            result.push({ ...roomsByType[type], type })
        }
        return result
    }
}
