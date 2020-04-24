import moment from 'moment'
import { Room } from '../models/room'
import { SelectedRoom } from './reservation.interface'

export const checkEnoughBeds = (actual: Room[], expected: SelectedRoom[]) => {
    const a: { [key: number]: number } = actual.reduce((acc, cur) => {
        return {
            ...acc,
            [cur.id]: cur.beds!.length
        }
    }, {})
    const valid = expected.every(e => a[e.id] >= e.guests)
    return valid
}

export const checkNoDuplicateRooms = (rooms: SelectedRoom[]) => {
    const map: { [key: number]: boolean } = {}
    for (let { id } of rooms) {
        const exist = map[id]
        if (exist) return false
        else map[id] = true
    }
    return true
}

export const validCheckInCheckOutDate = (checkIn: Date, checkOut: Date) => {
    return moment(checkIn).isBefore(checkOut, 'day')
}
