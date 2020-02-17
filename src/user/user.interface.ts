import { User } from '../models/user.model'

export type CreateUser = Omit<User, 'id'>

export type FindUser = Partial<User>
