import * as yup from 'yup'
import { StaffRole } from '../models/staff'
import { AdminCheckIn, CreateStaff, ListGuestsInput } from './admin.interface'

export const registerValidator = yup.object().shape<CreateStaff>({
    email: yup.string().email().required(),
    password: yup
        .string()
        .min(9)
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{9,}$/gm)
        .required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    phone: yup
        .string()
        .length(10)
        .matches(/^[0-9]{10}$/)
        .required(),
    address: yup.string().required(),
    role: yup
        .string()
        .oneOf([
            StaffRole.ADMIN,
            StaffRole.CLEANER,
            StaffRole.MANAGER,
            StaffRole.RECEPTIONIST
        ])
})

export const listGuestsValidator = yup.object().shape<ListGuestsInput>({
    page: yup.number().integer().positive(),
    size: yup.number().integer().positive()
})

export const listCheckInCheckOutValidator = listGuestsValidator

export const adminCheckInValidator = yup.object().shape<AdminCheckIn>({
    reservationID: yup.string().required(),
    date: yup.date()
})

export const adminCheckOutValidator = adminCheckInValidator
