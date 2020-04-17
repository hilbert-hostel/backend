import { Router } from 'express'
import { LoginInput } from '../auth/auth.interface'
import { loginValidator } from '../auth/auth.validation'
import { container } from '../container'
import { hasRole } from '../middlewares/hasRole'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { StaffRole } from '../models/staff'
import { getUserID } from '../utils'
import {
    CreateStaff,
    LoginStaffPayload,
    RegisterStaffPayload
} from './admin.interface'
import {
    listCheckInCheckOutValidator,
    listGuestsValidator,
    registerValidator
} from './admin.validation'

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
    const token = await jwtService.generateToken(
        staff.id,
        staff.email,
        staff.role
    )
    const payload: RegisterStaffPayload = { user: staff, token }
    res.json(payload)
})

router.post('/login', validateBody(loginValidator), async (req, res) => {
    const input = req.body as LoginInput
    const staff = await adminService.loginStaff(input)
    const token = await jwtService.generateToken(
        staff.id,
        staff.email,
        staff.role
    )
    const payload: LoginStaffPayload = { user: staff, token }
    res.json(payload)
})

router.get(
    '/guest',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    validateQuery(listGuestsValidator),
    async (req, res) => {
        const { page, size } = req.query
        const results = await adminService.listGuests(page, size)
        res.send(results)
    }
)

router.get(
    '/checkIn',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    validateQuery(listCheckInCheckOutValidator),
    async (req, res) => {
        const { page, size } = req.query
        const results = await adminService.listCheckInCheckOut(page, size)
        res.send(results)
    }
)

router.get(
    '/room',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    async (req, res) => {
        const rooms = await adminService.getAllRooms()
        res.send(rooms)
    }
)

router.get(
    '/ping',
    isAuthenticated,
    hasRole(StaffRole.ADMIN),
    async (req, res) => {
        const id = getUserID(res)
        const staff = await adminService.getStaff(id)
        res.send(staff)
    }
)

export { router as AdminRouter }
