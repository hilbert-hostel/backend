import { User, UserModel } from '../models/user.model'
import { CreateUser } from './user.interface'

export interface IUserRepository {
    create(data: CreateUser): Promise<User>
    findOne(condition: Partial<User>): Promise<User | undefined>
}
export class UserRepository implements IUserRepository {
    create(data: CreateUser) {
        return UserModel.query().insert(data)
    }

    findOne(condition: Partial<User>) {
        return UserModel.query().findOne(condition)
    }
}
