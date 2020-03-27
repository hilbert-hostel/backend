import { Guest } from '../models/guest'

export type CreateGuest = Omit<
    Guest,
    'id' | 'reservation_made' | 'reservation_in' | 'is_verified'
>

export type FindGuest = Partial<Guest>
