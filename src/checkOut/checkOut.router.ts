import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { getUserID } from '../utils'

const router = Router()
const { checkOutService } = container

router.get('/', isAuthenticated, async (req, res) => {
    const userID = getUserID(res)
    const code = await checkOutService.getCheckoutCode(userID, new Date())
    res.send(code)
})

router.post('/', async (req, res) => {
    const reservationID = req.body.reservationID as string
    const reservation = await checkOutService.checkOut(
        reservationID,
        new Date()
    )
    res.send(reservation)
})

export { router as CheckOutRouter }
