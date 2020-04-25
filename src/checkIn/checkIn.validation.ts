import * as yup from 'yup'
import {
    CheckIn,
    QueryReservationDetails,
    VerifyOTP
} from './checkIn.interface'
import { isValidDate } from '../utils'

export const queryReservationDetailsValidator = yup
    .object()
    .shape<QueryReservationDetails>({
        nationalID: yup
            .string()
            .length(13)
            .matches(/^[0-9]{13}$/)
            .required(),
        date: yup
            .string()
            .required()
            .test('is valid date', '${path} is not a valid date.', isValidDate)
    })

export const verifyOTPValidator = yup.object().shape<VerifyOTP>({
    otp: yup.string().length(6).required()
})

export const checkInValidator = yup.object().shape<CheckIn>({
    nationalID: yup
        .string()
        .length(13)
        .matches(/^[0-9]{13}$/)
        .required(),
    nameTH: yup.string().required(),
    nameEN: yup.string().required(),
    birthdate:         yup.string().required().test('is valid date', '${path} is not a valid date.', isValidDate),

    gender: yup.string().required(),
    issuer: yup.string().required(),
    issueDate:         yup.string().required().test('is valid date', '${path} is not a valid date.', isValidDate),

    expireDate:         yup.string().required().test('is valid date', '${path} is not a valid date.', isValidDate),

    address: yup.string().required()
})
