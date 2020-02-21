import { User } from '../models/user'

export type CreateUser = Omit<
    User,
    'id' | 'reservation_made' | 'reservation_in'
>

export type FindUser = Partial<User>
