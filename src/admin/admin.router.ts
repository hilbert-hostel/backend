import { Router } from 'express'
import { LoginInput } from '../auth/auth.interface'
import { loginValidator } from '../auth/auth.validation'
import { container } from '../container'
import { hasRole } from '../middlewares/hasRole'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { StaffRole } from '../models/staff'
import {
    CreateStaff,
    LoginStaffPayload,
    RegisterStaffPayload
} from './admin.interface'
import { listGuestsValidator, registerValidator } from './admin.validation'

const router = Router()
const { adminService, jwtService } = container
router.get(
    '/reservation',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    async (req, res) => {
        const { from = new Date(), to } = req.query
        const reservation = await adminService.listReservations(from, to)
        res.send(reservation)
    }
)

router.post('/register', validateBody(registerValidator), async (req, res) => {
    const input = req.body as CreateStaff
    const staff = await adminService.registerStaff(input)
    const token = await jwtService.generateToken(staff.id, staff.role)
    const payload: RegisterStaffPayload = { user: staff, token }
    res.json(payload)
})

router.post('/login', validateBody(loginValidator), async (req, res) => {
    const input = req.body as LoginInput
    const staff = await adminService.loginStaff(input)
    const token = await jwtService.generateToken(staff.id, staff.role)
    const payload: LoginStaffPayload = { user: staff, token }
    res.json(payload)
})

router.get(
    '/guests',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    validateQuery(listGuestsValidator),
    async (req, res) => {
        const { page, size } = req.query
        const results = await adminService.listGuests(page, size)
        res.send(results)
    }
)
export { router as AdminRouter }
