import { Router } from 'express'
import { RoomSearchPayload } from './reservation.interface'

const router = Router()

router.get('/', (req, res) => {
    const payload: RoomSearchPayload[] = [
        {
            type: 'Doulbe room',
            description: 'two beds',
            available: 2,
            price: 500,
            photo:
                'https://www.lkpattaya.com/president/images/accom/Deluxe-Double/ss/Deluxe-Double_1.jpg',
            facilities: ['bathroom', 'shower']
        }
    ]
    res.send(payload)
})

router.post('/', (req, res) => {
    res.send('1234-abcd')
})

export { router as ReservationRouter }
