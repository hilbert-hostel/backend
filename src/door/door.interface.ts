export interface DoorLockCodeEncodeInput {
    userID: string
    roomID: string
    nationalID: string
    secret: string
}

export interface DoorLockCodeDecodeInput {
    code: string
    roomID: number
}

export interface ShareRoomInput {
    email: string
    reservationID: string
    roomID: number
}
