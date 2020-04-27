import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { getUserID } from '../utils'
import { validateBody } from '../middlewares/validate'
import { checkOutValidator, rateValidator } from './checkOut.validation'
import { RateHostel, CheckOutInput } from './checkOut.interface'

const router = Router()
const { checkOutService } = container

router.get('/', isAuthenticated, async (req, res) => {
    const userID = getUserID(res)
    const code = await checkOutService.getCheckoutCode(userID, new Date())
    res.send(code)
})

router.post('/', validateBody(checkOutValidator), async (req, res) => {
    const { reservationID } = req.body as CheckOutInput
    const reservation = await checkOutService.checkOut(
        reservationID,
        new Date()
    )
    res.send(reservation)
})

router.post('/rate', validateBody(rateValidator), async (req, res) => {
    const { rating, reservationID } = req.body as RateHostel
    await checkOutService.rateHostel(reservationID, rating)
    res.send({ message: 'success' })
})
export { router as CheckOutRouter }
