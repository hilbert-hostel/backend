import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { getUserID } from '../utils'
import {
    RoomReservationInput,
    RoomSearchInput,
    UpdateReservationSpecialRequest
} from './reservation.interface'
import {
    roomReservationValidator,
    roomSearchValidator,
    updateReservationSpecialRequestsValidator
} from './reservation.validation'

const router = Router()
const { reservationService } = container
router.get('/', validateQuery(roomSearchValidator), async (req, res) => {
    const { checkIn, checkOut, guests } = req.query as RoomSearchInput
    const payload = await reservationService.findAvailableRooms(
        new Date(checkIn),
        new Date(checkOut),
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
        const guestID = getUserID(res)
        const reservation = await reservationService.makeReservation(
            new Date(checkIn),
            new Date(checkOut),
            guestID,
            rooms,
            specialRequests
        )
        res.send(reservation)
    }
)
router.get('/all', isAuthenticated, async (req, res) => {
    const guestID = getUserID(res)
    const reservation = await reservationService.listGuestReservations(guestID)
    res.send(reservation)
})
router.get('/:id', isAuthenticated, async (req, res) => {
    const reservationID = req.params.id as string
    const guestID = getUserID(res)
    const reservation = await reservationService.getReservationDetails(
        reservationID,
        guestID
    )
    res.send(reservation)
})
// TODO implement real payment system
router.get('/:id/payment', isAuthenticated, async (req, res) => {
    const reservationID = req.params.id as string
    const guestID = getUserID(res)
    const reservation = await reservationService.getReservationPaymentStatus(
        reservationID,
        guestID
    )
    res.send({ isPaid: true })
})

router.patch(
    '/:id',
    isAuthenticated,
    validateBody(updateReservationSpecialRequestsValidator),
    async (req, res) => {
        const reservationID = req.params.id
        const userID = getUserID(res)
        const { specialRequests } = req.body as UpdateReservationSpecialRequest
        const reservation = await reservationService.updateSpecialRequests(
            reservationID,
            specialRequests,
            userID
        )
        res.send(reservation)
    }
)
export { router as ReservationRouter }
