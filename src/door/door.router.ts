import { Router } from 'express'
import { container } from '../container'
import { validateQuery } from '../middlewares/validate'
import { DoorLockCodeEncodeInput } from './door.interface'
import {
    doorlockCodeDecodeValidator,
    doorlockCodeEncodeValidator
} from './door.validation'

const router = Router()
const { doorlockCodeService } = container

// for testing
// const doorlockCodeService = new DoorLockCodeService({
//     guestRepository: {
//         async create(input) {
//             return {
//                 id: '1234',
//                 is_verified: false,
//                 ...input
//             }
//         },
//         async findOne({ email }) {
//             const user = {
//                 id: '1234',
//                 email: 'email',
//                 password: 'doge',
//                 firstname: 'asd',
//                 lastname: 'asd',
//                 national_id: '1234567890123',
//                 phone: '0801234567',
//                 address: 'Earth',
//                 is_verified: false
//             }
//             return email === 'email' ? user : undefined
//         },

//         async findOneById(id) {
//             const user = {
//                 id: '1234',
//                 email: 'email',
//                 password: 'doge',
//                 firstname: 'asd',
//                 lastname: 'asd',
//                 national_id: '1234567890123',
//                 phone: '0801234567',
//                 address: 'Earth',
//                 is_verified: false
//             }
//             return id === '1234' ? user : undefined
//         },

//         async updateOneById(id, update) {
//             const user = {
//                 id: '1234',
//                 email: 'email',
//                 password: 'doge',
//                 firstname: 'asd',
//                 lastname: 'asd',
//                 national_id: '1234567890123',
//                 phone: '0801234567',
//                 address: 'Earth',
//                 is_verified: false
//             }
//             return id === '1234' ? { ...user, ...update } : undefined
//         },
//         async findOneByNationalId(nid) {
//             const user = {
//                 id: '1234',
//                 email: 'email',
//                 password: 'doge',
//                 firstname: 'asd',
//                 lastname: 'asd',
//                 national_id: '1234567890123',
//                 phone: '0801234567',
//                 address: 'Earth',
//                 is_verified: false
//             }
//             return nid === '1234567890123' ? user : undefined
//         }
//     },
// })

router.get(
    '/generate',
    validateQuery(doorlockCodeEncodeValidator),
    async (req, res) => {
        const input = (await doorlockCodeService.getDoorLockInput(
            req.query.userID,
            req.query.roomID
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
