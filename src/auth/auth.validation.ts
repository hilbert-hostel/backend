import * as yup from 'yup'
import { LoginInput, RegisterInput } from './auth.interface'

export const registerValidator = yup.object().shape<RegisterInput>({
    email: yup
        .string()
        .email()
        .required(),
    password: yup.string().required(),
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    phone: yup.string().required(),
    address: yup.string().required()
})

export const loginValidator = yup.object().shape<LoginInput>({
    email: yup
        .string()
        .email()
        .required(),
    password: yup.string().required()
})
