import { User, UserModel } from '../models/user.model'
import { CreateUser, FindUser } from './user.interface'

export interface IUserRepository {
    create(data: CreateUser): Promise<User>
    findOne(condition: Partial<User>): Promise<User | undefined>
    findOneById(id: string): Promise<User | undefined>
}
export class UserRepository implements IUserRepository {
    create(data: CreateUser) {
        return UserModel.query().insert(data)
    }

    findOne(condition: FindUser) {
        return UserModel.query().findOne(condition)
    }

    findOneById(id: string) {
        return UserModel.query().findById(id)
    }
}
