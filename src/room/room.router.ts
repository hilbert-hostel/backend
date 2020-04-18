import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { ReservationService } from '../reservation/reservation.service';

const router = Router()
const { reservationService } = container

router.get('/', isAuthenticated, async (req, res) => {
    const { reservation_id, guest_id } = req.query
    const payload = await reservationService.getReservationDetails(
		reservation_id,
		guest_id
	)
    res.send(payload.rooms)
})

export { router as RoomRouter }
