import { Room } from '../models/room'
import { SelectedRoom } from './reservation.interface'
import {
    checkEnoughBeds,
    checkNoDuplicateRooms,
    validCheckInCheckOutDate
} from './reservation.utils'

describe('check enough beds', () => {
    const rooms: Room[] = [
        {
            id: 1,
            price: 1,
            type: '1',
            facilities: [],
            beds: [
                { id: 1, room_id: 1 },
                { id: 2, room_id: 1 }
            ]
        },
        {
            id: 2,
            price: 1,
            type: '1',
            facilities: [],
            beds: [
                { id: 1, room_id: 2 },
                { id: 2, room_id: 2 },
                { id: 2, room_id: 2 }
            ]
        }
    ]
    test('should be true', () => {
        const selected1: SelectedRoom[] = [
            {
                id: 1,
                guests: 2
            },
            {
                id: 2,
                guests: 3
            }
        ]
        const selected2: SelectedRoom[] = [
            {
                id: 1,
                guests: 1
            },
            {
                id: 2,
                guests: 3
            }
        ]
        const selected3: SelectedRoom[] = [
            {
                id: 2,
                guests: 1
            }
        ]
        expect(checkEnoughBeds(rooms, selected1)).toBe(true)
        expect(checkEnoughBeds(rooms, selected2)).toBe(true)
        expect(checkEnoughBeds(rooms, selected3)).toBe(true)
    })
    test('should be false', () => {
        const selected1: SelectedRoom[] = [
            {
                id: 1,
                guests: 4
            },
            {
                id: 2,
                guests: 3
            }
        ]
        const selected2: SelectedRoom[] = [
            {
                id: 1,
                guests: 4
            },
            {
                id: 2,
                guests: 4
            }
        ]
        const selected3: SelectedRoom[] = [
            {
                id: 2,
                guests: 8
            }
        ]
        const selected4: SelectedRoom[] = [
            {
                id: 3,
                guests: 8
            }
        ]
        expect(checkEnoughBeds(rooms, selected1)).toBe(false)
        expect(checkEnoughBeds(rooms, selected2)).toBe(false)
        expect(checkEnoughBeds(rooms, selected3)).toBe(false)
        expect(checkEnoughBeds(rooms, selected4)).toBe(false)
    })
})

describe('check no duplicate rooms', () => {
    test('should be true', () => {
        const selected1: SelectedRoom[] = [
            {
                id: 1,
                guests: 8
            },
            {
                id: 2,
                guests: 8
            },
            {
                id: 3,
                guests: 8
            },
            {
                id: 4,
                guests: 8
            }
        ]
        const selected2: SelectedRoom[] = [
            {
                id: 1,
                guests: 8
            },
            {
                id: 2,
                guests: 8
            },
            {
                id: 5,
                guests: 8
            },
            {
                id: 9,
                guests: 8
            }
        ]
        expect(checkNoDuplicateRooms(selected1)).toBe(true)
        expect(checkNoDuplicateRooms(selected2)).toBe(true)
    })
    test('should be false', () => {
        const selected1: SelectedRoom[] = [
            {
                id: 1,
                guests: 8
            },
            {
                id: 1,
                guests: 8
            },
            {
                id: 4,
                guests: 8
            },
            {
                id: 4,
                guests: 8
            }
        ]
        const selected2: SelectedRoom[] = [
            {
                id: 1,
                guests: 8
            },
            {
                id: 1,
                guests: 8
            },
            {
                id: 1,
                guests: 8
            }
        ]
        const selected3: SelectedRoom[] = [
            {
                id: 1,
                guests: 8
            },
            {
                id: 2,
                guests: 8
            },
            {
                id: 3,
                guests: 8
            },
            {
                id: 3,
                guests: 8
            }
        ]
        expect(checkNoDuplicateRooms(selected1)).toBe(false)
        expect(checkNoDuplicateRooms(selected2)).toBe(false)
        expect(checkNoDuplicateRooms(selected3)).toBe(false)
    })
})

describe('check valid date', () => {
    test('should be true', () => {
        const checkIn = new Date('2020-02-20')
        const checkOut = new Date('2020-02-25')

        expect(validCheckInCheckOutDate(checkIn, checkOut)).toBe(true)
    })
    test('should be false', () => {
        const checkIn = new Date('2020-02-26')
        const checkOut1 = new Date('2020-02-26')
        const checkOut2 = new Date('2020-02-25')
        expect(validCheckInCheckOutDate(checkIn, checkOut1)).toBe(false)
        expect(validCheckInCheckOutDate(checkIn, checkOut2)).toBe(false)
    })
})
