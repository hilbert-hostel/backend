import { Router } from 'express'
import moment from 'moment'
import { LoginInput } from '../auth/auth.interface'
import { loginValidator } from '../auth/auth.validation'
import { container } from '../container'
import { DoorLockCodeEncodeInput } from '../door/door.interface'
import { hasRole } from '../middlewares/hasRole'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validateQuery } from '../middlewares/validate'
import { StaffRole } from '../models/staff'
import { getUserID } from '../utils'
import {
    AdminCheckIn,
    AdminCheckOut,
    CreateRoomMaintenanceInput,
    CreateStaff,
    LoginStaffPayload,
    RegisterStaffPayload
} from './admin.interface'
import {
    adminCheckInValidator,
    adminCheckOutValidator,
    createRoomMaintenanceValidator,
    listCheckInCheckOutValidator,
    listGuestsValidator,
    registerValidator,
    reservationValidator,
    summaryValidator
} from './admin.validation'

const router = Router()
const {
    adminService,
    jwtService,
    checkOutService,
    doorlockCodeService
} = container
router.get(
    '/reservation',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    validateQuery(reservationValidator),
    async (req, res) => {
        const { from, to } = req.query
        const reservation = await adminService.listReservations(
            from ?? moment().toDate(),
            to ?? moment().add(1, 'week').toDate()
        )
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
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
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
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
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
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        const rooms = await adminService.getAllRooms()
        res.send(rooms)
    }
)

router.get(
    '/ping',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        const id = getUserID(res)
        const staff = await adminService.getStaff(id)
        res.send(staff)
    }
)

router.post(
    '/unlock',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        adminService.unlockDoor(req.body.roomID)
        res.send({ message: 'unlocked' })
    }
)

router.post(
    '/checkIn',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    validateBody(adminCheckInValidator),
    async (req, res) => {
        const { reservationID, date } = req.body as AdminCheckIn
        const result = await adminService.checkIn(reservationID, new Date(date))
        res.send({ message: result })
    }
)

router.post(
    '/checkOut',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    validateBody(adminCheckOutValidator),
    async (req, res) => {
        const { reservationID, date } = req.body as AdminCheckOut
        const result = await checkOutService.checkOut(
            reservationID,
            new Date(date)
        )
        res.send({ message: result })
    }
)

router.post(
    '/maintenance',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    validateBody(createRoomMaintenanceValidator),
    async (req, res) => {
        const {
            roomID,
            from,
            to,
            description
        } = req.body as CreateRoomMaintenanceInput
        const maintenance = await adminService.createRoomMaintenance(
            roomID,
            new Date(from),
            new Date(to),
            description
        )
        res.send(maintenance)
    }
)
router.get(
    '/maintenance',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        const { from, to } = req.query
        const maintenance = await adminService.listRoomMaintenance(
            from ?? moment().toDate(),
            to ?? moment().add(1, 'week').toDate()
        )
        res.send(maintenance)
    }
)
router.delete(
    '/maintenance/:id',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        const id = Number(req.params.id)
        const maintenance = await adminService.deleteRoomMaintenance(id)
        res.send(maintenance)
    }
)

router.get(
    '/generate',
    isAuthenticated,
    hasRole(StaffRole.ADMIN, StaffRole.MANAGER),
    async (req, res) => {
        const { userID } = res.locals
        const input = (await adminService.getDoorLockInput(
            userID
        )) as DoorLockCodeEncodeInput
        const encodedInput = doorlockCodeService.encode(input)
        res.json({ code: encodedInput })
    }
)
router.get(
    '/summary',
    isAuthenticated,
    hasRole(StaffRole.MANAGER),
    validateQuery(summaryValidator),
    async (req, res) => {
        const { from, to } = req.query
        const summary = await adminService.generateSummary(
            from ?? moment().toDate(),
            to ?? moment().add(1, 'week').toDate()
        )
        res.json(summary)
    }
)
export { router as AdminRouter }
