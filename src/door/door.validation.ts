import * as yup from 'yup'
import { DoorLockCodeEncodeInput, DoorLockCodeDecodeInput } from './door.interface'

export const doorlockCodeEncodeValidator = yup.object().shape<DoorLockCodeEncodeInput>({
	userID: yup.string().required(),
	roomID: yup.string().required(),
	nationalID: yup.string().required(),
	secret: yup.string().required(),
})

export const doorlockCodeDecodeValidator = yup.object().shape<DoorLockCodeDecodeInput>({
	encoded: yup.string()
})
