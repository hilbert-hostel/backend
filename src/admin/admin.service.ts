import { compare, hash } from 'bcryptjs'
import { evolve, map, omit, pick, pipe } from 'ramda'
import { GuestDetails, LoginInput } from '../auth/auth.interface'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { renameKeys } from '../utils'
import { CreateStaff, ReservationInfo, StaffDetails } from './admin.interface'
import { IAdminRespository } from './admin.repository'

export interface IAdminService {
    listReservations(from: Date, to: Date): Promise<ReservationInfo[]>
    registerStaff(data: CreateStaff): Promise<StaffDetails>
    loginStaff(data: LoginInput): Promise<StaffDetails>
    listGuests(page: number, size: number): Promise<GuestDetails[]>
}

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
                    guest: pipe(
                        omit(['password']),
                        renameKeys({
                            national_id: 'nationalID',
                            is_verified: 'isVerified'
                        })
                    )
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
        return map(
            pipe(
                omit(['password']),
                renameKeys({
                    national_id: 'nationalID',
                    is_verified: 'isVerified'
                })
            )
        )(guests) as GuestDetails[]
    }
}
