import uuid from 'uuid/v4'
import BaseModel from './base'
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
export default class UserModel extends BaseModel implements User {
    id!: string
    username!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    phone?: string
    address?: string
    static tableName = 'user'
    $beforeInsert() {
        this.id = uuid()
    }
}
