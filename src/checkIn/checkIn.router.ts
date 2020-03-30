import { Router } from 'express'
import moment from 'moment'
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
const { jwtService } = container
const router = Router()
router.get(
    '/',
    validatQuery(queryReservationDetailsValidator),
    async (req, res) => {
        const { nationalID, date } = req.query as QueryReservationDetails
        const checkOut = moment(date)
            .add(3, 'day')
            .toISOString()
        res.send({
            id: 'f7AEswTW8',
            checkIn: date.toISOString(),
            checkOut,
            specialRequests: '',
            rooms: [
                {
                    id: 3,
                    price: 600,
                    type: 'mixed-dorm-s',
                    description:
                        'Private room with twin-size bed with 6 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.',
                    beds: 4,
                    photos: [
                        {
                            photo_url:
                                'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg',
                            photo_description: null
                        }
                    ],
                    facilities: [
                        {
                            name: 'bottled water',
                            description: 'per person per night',
                            count: 1
                        }
                    ]
                }
            ]
        })
    }
)

router.post('/generate-otp/:id', async (req, res) => {
    res.send({ ref: 'Yama69' })
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
