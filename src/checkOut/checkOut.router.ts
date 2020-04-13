import { Router } from 'express'
import { container } from '../container'

const router = Router()
const { checkOutService } = container
router.post('/', async (req, res) => {
    const reservationID = req.body.reservationID as string
    const reservation = await checkOutService.checkOut(reservationID)
    res.send(reservation)
})

export { router as CheckOutRouter }
