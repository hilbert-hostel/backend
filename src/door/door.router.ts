import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateQuery } from '../middlewares/validate'
import { DoorLockCodeEncodeInput } from './door.interface'
import {
    doorlockCodeDecodeValidator,
    generateDoorLockCodeValidator
} from './door.validation'

const router = Router()
const { doorlockCodeService } = container

router.get(
    '/generate',
    isAuthenticated,
    validateQuery(generateDoorLockCodeValidator),
    async (req, res) => {
        const { userID, email } = res.locals
        const { roomID } = req.query
        // const
        const input = (await doorlockCodeService.getDoorLockInput(
            userID,
            roomID
        )) as DoorLockCodeEncodeInput
        const encodedInput = doorlockCodeService.encode(input)
        res.json(encodedInput)
    }
)

router.get(
    '/verify',
    validateQuery(doorlockCodeDecodeValidator),
    async (req, res) => {
        const isValid = doorlockCodeService.verify({
            encoded: req.query.encoded
        })
        res.json(isValid)
    }
)

export { router as DoorLockCodeRouter }
