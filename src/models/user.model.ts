import { Model } from 'objection'

export interface User {
    id: string
    username: string
    email: string
    password: string
    firstname: string
    lastname: string
    phone?: string
    address?: string
}
export class UserModel extends Model implements User {
    id!: string
    username!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    phone?: string
    address?: string
    static tableName = 'users'
}
