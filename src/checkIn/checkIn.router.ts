import { Router } from 'express'
import multer from 'multer'
import { container } from '../container'
import { BadRequestError } from '../error/HttpError'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { getUserID } from '../utils'
import {
    CheckIn,
    QueryReservationDetails,
    VerifyOTP
} from './checkIn.interface'
import {
    checkInValidator,
    queryReservationDetailsValidator,
    verifyOTPValidator
} from './checkIn.validation'
const { jwtService, checkInService } = container
const router = Router()
router.get(
    '/',
    validateQuery(queryReservationDetailsValidator),
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
        const id = req.params.id
        const valid = await checkInService.verifyOtp(id, otp)
        if (valid) {
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
        const id = getUserID(res)
        const idCardDetails = req.body as CheckIn
        if (!('kioskPhoto' in req.files) || !('idCardPhoto' in req.files))
            throw new BadRequestError('Photos missing.')
        const message = await checkInService.addCheckInRecord(
            id,
            req.files.kioskPhoto,
            req.files.idCardPhoto,
            idCardDetails,
            new Date()
        )
        res.send({ message })
    }
)

export { router as CheckInRouter }
