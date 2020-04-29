import * as yup from 'yup'
import { CheckOutInput, RateHostel } from './checkOut.interface'

export const checkOutValidator = yup.object().shape<CheckOutInput>({
    reservationID: yup.string().required()
})

export const rateValidator = yup.object().shape<RateHostel>({
    reservationID: yup.string().required(),
    rating: yup.number().integer().min(0).max(5).required()
})
