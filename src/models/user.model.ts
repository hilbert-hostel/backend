import { Model } from 'objection'

export class UserModel extends Model {
    id!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    static tableName = 'users'
}
