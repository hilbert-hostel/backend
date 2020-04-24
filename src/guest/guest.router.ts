import { Router } from 'express'
import { omit } from 'ramda'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody } from '../middlewares/validate'
import { updateGuestValidation } from './guest.validation'
import { UpdateGuest } from './guest.interface'
import { getUserID } from '../utils'

const router = Router()
const { guestService } = container

router.patch(
    '/',
    isAuthenticated,
    validateBody(updateGuestValidation),
    async (req, res) => {
        const input = req.body as UpdateGuest
        const userID = getUserID(res)

        const payload = await guestService.updateProfile(userID, input)
        res.json(payload)
    }
)

export { router as GuestRouter }
