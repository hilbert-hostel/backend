import * as yup from 'yup'
import { LoginInput, RegisterInput, VerifyUserInput } from './auth.interface'

export const registerValidator = yup.object().shape<RegisterInput>({
    email: yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .min(9)
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{9,}$/gm)
        .required(),
    firstname: yup.string().required(),
    nationalID: yup
        .string()
        .length(13)
        .matches(/^[0-9]{13}$/)
        .required(),
    lastname: yup.string().required(),
    phone: yup
        .string()
        .length(10)
        .matches(/^[0-9]{10}$/)
        .required(),
    address: yup.string().required()
})

export const loginValidator = yup.object().shape<LoginInput>({
    email: yup.string().required(),
    password: yup.string().required()
})

export const verifyUserValidator = yup.object().shape<VerifyUserInput>({
    userID: yup.string().required(),
    token: yup
        .string()
        .required()
        .matches(/^\d{6}$/)
})

export const checkAvailableValidator = yup.object().shape({
    input: yup.string().required()
})
