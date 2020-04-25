import uuid from 'uuid/v4'
import BaseModel from './base'
import { GenID } from './decorators'

export const enum StaffRole {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    RECEPTIONIST = 'RECEPTIONIST',
    CLEANER = 'CLEANER'
}

export interface Staff {
    id: string
    email: string
    password: string
    firstname: string
    lastname: string
    phone: string
    address: string
    role: string
}

@GenID(uuid)
export default class StaffModel extends BaseModel implements Staff {
    id!: string
    email!: string
    password!: string
    firstname!: string
    lastname!: string
    phone!: string
    address!: string
    role!: string
    static tableName = 'staff'
}
