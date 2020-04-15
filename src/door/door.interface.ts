export interface DoorLockCodeEncodeInput {
	userID: string
	roomID: string
	nationalID: string
	secret: string
}

export interface DoorLockCodeDecodeInput {
	encoded: string
}