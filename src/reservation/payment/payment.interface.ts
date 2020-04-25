export interface Receipt {
    reservationID: string
    transactionID: string
    checkIn: Date
    checkOut: Date
    method: string
    name: string
    rooms: {
        id: number
        beds: number
    }[]
    amount: number
}
