import { Router } from 'express'
import { AuthRouter } from './auth/auth.router'
import { CheckInRouter } from './checkIn/checkIn.router'
import { ReservationRouter } from './reservation/reservation.router'
import { CheckOutRouter } from './checkOut/checkOut.router'
import { AdminRouter } from './admin/admin.router'
import { DoorLockCodeRouter } from './door/door.router'
import { RoomRouter } from './room/room.router'

const router = Router()

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    })
})
router.use('/auth', AuthRouter)
router.use('/reservation', ReservationRouter)
router.use('/checkIn', CheckInRouter)
router.use('/checkOut', CheckOutRouter)
router.use('/admin', AdminRouter)
router.use('/door', DoorLockCodeRouter)
router.use('/rooms', RoomRouter)
export { router as Router }
