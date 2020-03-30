import { Router } from 'express'
import { AuthRouter } from './auth/auth.router'
import { CheckInRouter } from './checkIn/checkIn.router'
import { ReservationRouter } from './reservation/reservation.router'

const router = Router()

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    })
})
router.use('/auth', AuthRouter)
router.use('/reservation', ReservationRouter)
router.use('/checkIn', CheckInRouter)
export { router as Router }
