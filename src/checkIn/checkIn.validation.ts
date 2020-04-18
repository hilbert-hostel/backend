import * as yup from 'yup'
import {
    CheckIn,
    QueryReservationDetails,
    VerifyOTP
} from './checkIn.interface'

export const queryReservationDetailsValidator = yup
    .object()
    .shape<QueryReservationDetails>({
        nationalID: yup
            .string()
            .length(13)
            .matches(/^[0-9]{13}$/)
            .required(),
        date: yup.date().required()
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
    birthdate: yup.date().required(),
    gender: yup.string().required(),
    issuer: yup.string().required(),
    issueDate: yup.date().required(),
    expireDate: yup.date().required(),
    address: yup.string().required()
})
