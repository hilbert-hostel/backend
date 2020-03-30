export interface QueryReservationDetails {
    nationalID: string
    date: Date
}

export interface VerifyOTP {
    otp: string
}

export interface CheckIn {
    nationalID: string
    nameTH: string
    nameEN: string
    birthdate: Date
    gender: string
    issuer: string
    issueDate: Date
    expireDate: Date
    address: string
}
