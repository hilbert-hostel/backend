import { Router } from 'express'
import { container } from '../container'
import { ForbiddenError } from '../error/HttpError'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { getUserID } from '../utils'
import { DoorLockCodeEncodeInput, ShareRoomInput } from './door.interface'
import {
    doorlockCodeDecodeValidator,
    generateDoorLockCodeValidator,
    shareRoomValidator
} from './door.validation'

const router = Router()
const { doorlockCodeService, roomService } = container

router.get(
    '/generate',
    isAuthenticated,
    validateQuery(generateDoorLockCodeValidator),
    async (req, res) => {
        const { userID, email } = res.locals
        const { roomID } = req.query
        const date = new Date()
        const allow = await roomService.hasPermissionToEnterRoom(
            userID,
            email,
            date,
            roomID
        )
        if (!allow) {
            throw new ForbiddenError('You are not allowed to enter this room.')
        }
        const input = (await doorlockCodeService.getDoorLockInput(
            userID,
            String(roomID)
        )) as DoorLockCodeEncodeInput
        const encodedInput = doorlockCodeService.encode(input)
        res.json({ code: encodedInput })
    }
)

router.post(
    '/verify',
    validateQuery(doorlockCodeDecodeValidator),
    async (req, res) => {
        const { code, roomID } = req.body
        const isValid = doorlockCodeService.verify(
            {
                code
            },
            roomID
        )
        doorlockCodeService.unlockDoor(roomID)
        console.log(isValid)
        res.json(isValid)
    }
)

router.post(
    '/share',
    validateBody(shareRoomValidator),
    isAuthenticated,
    async (req, res) => {
        const { email, reservationID, roomID } = req.body as ShareRoomInput
        const userID = getUserID(res)
        await roomService.shareRoom(userID, email, reservationID, roomID)
        res.send({ message: 'success' })
    }
)

router.get('/room', isAuthenticated, async (req, res) => {
    const date = new Date()
    const { userID, email } = res.locals
    const rooms = await roomService.findRoomsThatCanEnter(userID, email, date)
    res.send({ rooms })
})
export { router as DoorLockCodeRouter }
