import { User, UserModel } from '../models/user.model'
import { CreateUser } from './user.interface'

export class UserRepository {
    create(data: CreateUser) {
        return UserModel.query().insert(data)
    }

    findOne(condition: Partial<User>) {
        return UserModel.query().findOne(condition)
    }
}
