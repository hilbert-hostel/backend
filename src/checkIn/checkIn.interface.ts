export interface QueryReservationDetails {
    nationalID: string
    date: string
}

export interface VerifyOTP {
    otp: string
}

export interface CheckIn {
    nationalID: string
    nameTH: string
    nameEN: string
    birthdate: string
    gender: string
    issuer: string
    issueDate: string
    expireDate: string
    address: string
}

export interface OtpReference {
    referenceCode: string
}
