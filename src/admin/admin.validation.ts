import * as yup from 'yup'
import { StaffRole } from '../models/staff'
import {
    AdminCheckIn,
    CreateRoomMaintenanceInput,
    CreateStaff,
    ListGuestsInput
} from './admin.interface'
import { isValidDate } from '../utils'

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
    date: yup
        .string()
        .required()
        .test('is valid date', '${path} is not a valid date.', isValidDate)
})

export const adminCheckOutValidator = adminCheckInValidator

export const createRoomMaintenanceValidator = yup
    .object()
    .shape<CreateRoomMaintenanceInput>({
        roomID: yup.number().integer().required(),
        from: yup
            .string()
            .required()
            .test('is valid date', '${path} is not a valid date.', isValidDate),
        to: yup
            .string()
            .required()
            .test('is valid date', '${path} is not a valid date.', isValidDate),
        description: yup.string()
    })

export const reservationValidator = yup.object().shape({
    from: yup
        .string()
        .test(
            'is valid date',
            '${path} is not a valid date.',
            d => !d || isValidDate(d)
        ),
    to: yup
        .string()
        .test(
            'is valid date',
            '${path} is not a valid date.',
            d => !d || isValidDate(d)
        )
})

export const summaryValidator = reservationValidator
