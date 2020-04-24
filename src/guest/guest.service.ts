import { Dependencies } from '../container'
import { IGuestRepository } from '../guest/guest.repository'
import { UpdateGuest } from './guest.interface'
import { GuestDetails } from '../auth/auth.interface'
import { renameKeys } from '../utils'
import { Guest } from '../models/guest'
import { BadRequestError } from '../error/HttpError'
import { getGuestDetails } from './guest.utils'

export interface IGuestService {
    updateProfile(guestID: string, input: UpdateGuest): Promise<GuestDetails>
}

export class GuestService implements IGuestService {
    private readonly guestRepository: IGuestRepository
    constructor({ guestRepository }: Dependencies<IGuestRepository>) {
        this.guestRepository = guestRepository
    }

    async updateProfile(guestID: string, input: UpdateGuest) {
        const formatted = renameKeys(
            { nationalID: 'national_id' },
            input
        ) as Partial<Guest>
        const guest = await this.guestRepository.findOneById(guestID)
        if (!guest) {
            throw new BadRequestError('Invalid User ID')
        }
        const updatedGuest = (await this.guestRepository.updateOneById(
            guestID,
            formatted
        )) as Guest
        return getGuestDetails(updatedGuest)
    }
}
