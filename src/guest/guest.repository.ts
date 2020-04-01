import GuestModel, { Guest } from '../models/guest'
import { CreateGuest, FindGuest } from './guest.interface'

export interface IGuestRepository {
    create(data: CreateGuest): Promise<Guest>
    findOne(condition: Partial<Guest>): Promise<Guest | undefined>
    findOneById(id: string): Promise<Guest | undefined>
    updateOneById(
        id: string,
        update: Partial<Guest>
    ): Promise<Guest | undefined>
    findOneByNationalId(national_id: string): Promise<Guest | undefined>
}
export class GuestRepository implements IGuestRepository {
    create(data: CreateGuest) {
        return GuestModel.query().insert(data)
    }

    findOne(condition: FindGuest) {
        return GuestModel.query().findOne(condition)
    }

    findOneById(id: string) {
        return GuestModel.query().findById(id)
    }

    findOneByNationalId(national_id: string) {
        return GuestModel.query().findOne({ national_id })
    }

    updateOneById(id: string, update: Partial<Guest>) {
        return GuestModel.query().patchAndFetchById(id, update)
    }
}
