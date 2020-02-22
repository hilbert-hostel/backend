import { Router } from 'express'
import { container } from '../container'
import { RoomSearchInput } from './reservation.interface'

const router = Router()
const { reservationService } = container
router.get('/', async (req, res) => {
    const { checkIn, checkOut, guests } = req.query as RoomSearchInput
    const payload = await reservationService.findAvailableRooms(
        checkIn,
        checkOut,
        guests
    )
    res.send(payload)
})

router.post('/', (req, res) => {
    res.send('1234-abcd')
})

export { router as ReservationRouter }
