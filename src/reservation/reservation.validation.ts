import * as yup from 'yup'
import { RoomReservationInput, RoomSearchInput } from './reservation.interface'

export const roomSearchValidator = yup.object().shape<RoomSearchInput>({
    checkIn: yup.string().required(),
    checkOut: yup.string().required(),
    guests: yup
        .number()
        .integer()
        .positive()
        .required()
})
export const roomReservationValidator = yup
    .object()
    .shape<RoomReservationInput>({
        checkIn: yup.string().required(),
        checkOut: yup.string().required(),
        rooms: yup.array(
            yup.object().shape({
                id: yup
                    .number()
                    .integer()
                    .required(),
                guests: yup
                    .number()
                    .integer()
                    .positive()
                    .required()
            })
        ),
        specialRequests: yup.string()
    })
// export const registerValidator = yup.object().shape<RegisterInput>({
//     email: yup
//         .string()
//         .email()
//         .required(),
//     password: yup
//         .string()
//         .min(9)
//         .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{9,}$/gm)
//         .required(),
//     firstname: yup.string().required(),
//     nationalID: yup
//         .string()
//         .length(13)
//         .matches(/^[0-9]{13}$/)
//         .required(),
//     lastname: yup.string().required(),
//     phone: yup
//         .string()
//         .length(10)
//         .matches(/^[0-9]{10}$/)
//         .required(),
//     address: yup.string().required()
// })

// export const loginValidator = yup.object().shape<LoginInput>({
//     email: yup.string().required(),
//     password: yup.string().required()
// })

// export const verifyUserValidator = yup.object().shape<VerifyUserInput>({
//     userID: yup.string().required(),
//     token: yup
//         .string()
//         .required()
//         .matches(/^\d{6}$/)
// })
