import { omit, pipe } from 'ramda'
import { GuestDetails } from '../auth/auth.interface'
import { Guest } from '../models/guest'
import { renameKeys } from '../utils'

export const getGuestDetails: (guest: Guest) => GuestDetails = pipe(
    omit(['password']),
    renameKeys({
        national_id: 'nationalID',
        is_verified: 'isVerified'
    }) as any
)
