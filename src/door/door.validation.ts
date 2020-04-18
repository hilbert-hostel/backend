import * as yup from 'yup'
import { DoorLockCodeDecodeInput, ShareRoomInput } from './door.interface'

export const generateDoorLockCodeValidator = yup.object().shape({
    roomID: yup.number().integer().required()
})

export const doorlockCodeDecodeValidator = yup
    .object()
    .shape<DoorLockCodeDecodeInput>({
        code: yup.string()
    })

export const shareRoomValidator = yup.object().shape<ShareRoomInput>({
    email: yup.string().email().required(),
    reservationID: yup.string().required(),
    roomID: yup.number().integer()
})
