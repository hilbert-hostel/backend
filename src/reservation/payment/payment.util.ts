import { Room } from '../../models/room'
import { Receipt } from './payment.interface'
import moment from 'moment'

export const calculatePrice = (rooms: Room[]): number => {
    const priceOfEachRoom = rooms.map(r => r.price * (r?.beds?.length ?? 0))
    return priceOfEachRoom.reduce((acc, cur) => acc + cur, 0)
}

export const formatReceiptMessage = (data: Receipt): string => {
    const roomSummary = data.rooms
        .map(({ id, beds }) => `Room ${id}: ${beds} beds`)
        .join('\n')
    const cin = moment(data.checkIn).format('dddd, MMMM Do YYYY')
    const cout = moment(data.checkOut).format('dddd, MMMM Do YYYY')
    const nights = moment(data.checkOut).diff(moment(data.checkIn), 'days')
    const totalRooms = data.rooms.length
    const totalBeds = data.rooms.reduce((acc, curr) => acc + curr.beds, 0)
    const message = `Dear ${data.name},
    
Thank you for choosing Hilbert. Here is your receipt:
Transaction ID: ${data.transactionID}
Method of Payment: ${data.method}
Amount: ${data.amount}

Reservation Details:
Reservation ID: ${data.reservationID}
Check In: ${cin}
Check Out ${cout}
Duration: ${nights} nights
Room Details:
${roomSummary}
Total Number of Rooms: ${totalRooms}
Total Number of Beds: ${totalBeds}
`
    return message
}
