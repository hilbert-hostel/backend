import { User } from '../models/user'

export type CreateUser = Omit<User, 'id' | 'phone' | 'address'>

export type FindUser = Partial<User>
