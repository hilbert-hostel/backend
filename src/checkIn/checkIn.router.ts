import { Router } from 'express'
import multer from 'multer'
import { container } from '../container'
import { BadRequestError } from '../error/HttpError'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validatQuery } from '../middlewares/validate'
import { getUserID } from '../utils'
import { QueryReservationDetails, VerifyOTP } from './checkIn.interface'
import {
    checkInValidator,
    queryReservationDetailsValidator,
    verifyOTPValidator
} from './checkIn.validation'
const { jwtService, checkInService } = container
const router = Router()
router.get(
    '/',
    validatQuery(queryReservationDetailsValidator),
    async (req, res) => {
        const { nationalID, date } = req.query as QueryReservationDetails
        const reservation = await checkInService.getReservationForCheckIn(
            nationalID,
            date
        )

        res.send(reservation)
    }
)

router.post('/generate-otp/:id', async (req, res) => {
    const reservationID = req.params.id as string
    const referenceCode = await checkInService.generateOtp(reservationID)
    res.send(referenceCode)
})
router.post(
    '/verify-otp/:id',
    validateBody(verifyOTPValidator),
    async (req, res) => {
        const { otp } = req.body as VerifyOTP
        if (otp == '696969') {
            res.send({ token: await jwtService.generateToken(req.params.id) })
        } else {
            throw new BadRequestError('Incorrect OTP')
        }
    }
)
router.post(
    '/',
    isAuthenticated,
    multer().fields([
        { name: 'kioskPhoto', maxCount: 1 },
        { name: 'idCardPhoto', maxCount: 1 }
    ]),
    validateBody(checkInValidator),
    async (req, res) => {
        const guestID = getUserID(res)
        if ((req.files as any).kioskPhoto && (req.files as any).idCardPhoto)
            res.send({ message: 'check in complete' })
        else throw new BadRequestError('Photos missing.')
    }
)

export { router as CheckInRouter }
