import * as yup from 'yup'
import { DoorLockCodeEncodeInput, DoorLockCodeDecodeInput } from './door.interface'

export const generateDoorLockCodeValidator = yup.object().shape({
	userID: yup.string().required(),
	roomID: yup.string().required(),
	nationalID: yup.string().required(),
	secret: yup.string().required(),
})

export const doorlockCodeDecodeValidator = yup.object().shape<DoorLockCodeDecodeInput>({
	encoded: yup.string()
})
