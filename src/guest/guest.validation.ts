import * as yup from 'yup'
import { UpdateGuest } from './guest.interface'

export const updateGuestValidation = yup.object().shape<UpdateGuest>({
    firstname: yup.string(),
    nationalID: yup
        .string()
        .length(13)
        .matches(/^[0-9]{13}$/),
    lastname: yup.string(),
    phone: yup
        .string()
        .length(10)
        .matches(/^[0-9]{10}$/),
    address: yup.string()
})
