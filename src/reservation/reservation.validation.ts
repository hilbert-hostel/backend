import * as yup from 'yup'
import {
    RoomReservationInput,
    RoomSearchInput,
    UpdateReservationSpecialRequest
} from './reservation.interface'
import { isValidDate } from '../utils'

export const roomSearchValidator = yup.object().shape<RoomSearchInput>({
    checkIn: yup
        .string()
        .required()
        .test('is valid date', '${path} is not a valid date.', isValidDate),
    checkOut: yup
        .string()
        .required()
        .test('is valid date', '${path} is not a valid date.', isValidDate),
    guests: yup.number().integer().positive().required()
})
export const roomReservationValidator = yup
    .object()
    .shape<RoomReservationInput>({
        checkIn: yup
            .string()
            .required()
            .test('is valid date', '${path} is not a valid date.', isValidDate),
        checkOut: yup
            .string()
            .required()
            .test('is valid date', '${path} is not a valid date.', isValidDate),
        rooms: yup.array(
            yup.object().shape({
                id: yup.number().integer().required(),
                guests: yup.number().integer().positive().required()
            })
        ),
        specialRequests: yup.string()
    })

export const updateReservationSpecialRequestsValidator = yup
    .object()
    .shape<UpdateReservationSpecialRequest>({
        specialRequests: yup.string().required()
    })
