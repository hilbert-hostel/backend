import * as yup from 'yup'
import { LoginInput, RegisterInput } from './auth.interface'

export const registerValidator = yup.object().shape<RegisterInput>({
    username: yup
        .string()
        .min(6)
        .max(64)
        .matches(/^(?=.*[a-zA-Z]).{6,}$/gm)
        .required(),
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
    lastname: yup.string().required()
})

export const loginValidator = yup.object().shape<LoginInput>({
    username: yup.string().required(),
    password: yup.string().required()
})
