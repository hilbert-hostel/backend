import { User } from '../models/user'

export type CreateUser = Omit<
    User,
    'id' | 'reservation_made' | 'reservation_in' | 'is_verified'
>

export type FindUser = Partial<User>
