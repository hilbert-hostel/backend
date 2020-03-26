import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validatQuery } from '../middlewares/validate'
import { RoomReservationInput, RoomSearchInput } from './reservation.interface'
import {
    roomReservationValidator,
    roomSearchValidator
} from './reservation.validation'

const router = Router()
const { reservationService } = container
router.get('/', validatQuery(roomSearchValidator), async (req, res) => {
    const { checkIn, checkOut, guests } = req.query as RoomSearchInput
    const payload = await reservationService.findAvailableRooms(
        checkIn,
        checkOut,
        guests
    )
    res.send(payload)
})

router.post(
    '/',
    validateBody(roomReservationValidator),
    isAuthenticated,
    async (req, res) => {
        const {
            checkIn,
            checkOut,
            rooms,
            specialRequests
        } = req.body as RoomReservationInput
        const guestID = res.locals.userID
        const reservation = await reservationService.makeReservation(
            checkIn,
            checkOut,
            guestID,
            rooms,
            specialRequests
        )
        res.send(reservation)
    }
)

export { router as ReservationRouter }
