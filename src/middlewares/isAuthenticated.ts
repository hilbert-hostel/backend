import { RequestHandler } from 'express'
import { Bearer } from 'permit'
import { container } from '../container'
import { UnauthorizedError } from '../error/HttpError'
import { isEmpty } from '../utils'
import { StaffRole } from '../models/staff'

const permit = new Bearer({})
const { guestRepository, adminRepository } = container
export const isAuthenticated: RequestHandler = async (req, res, next) => {
    const token = permit.check(req)
    if (!token) {
        permit.fail(res)
        const err = new UnauthorizedError(`Authentication is required!`)
        return next(err)
    }
    const { userID, role, email } = await container.jwtService.verifyToken(
        token
    )
    if (!userID) {
        permit.fail(res)
        return next(new UnauthorizedError(`Authentication is required!`))
    }
    if (isEmpty(userID) || isEmpty(role) || isEmpty(email)) {
        return next(new UnauthorizedError(`Invalid Token!`))
    }
    console.log(role)
    if (role === 'GUEST') {
        const user = await guestRepository.findOneById(userID)
        if (!user) {
            return next(new UnauthorizedError('Invalid ID'))
        }
    } else if (
        [
            StaffRole.ADMIN,
            StaffRole.CLEANER,
            StaffRole.MANAGER,
            StaffRole.RECEPTIONIST
        ].includes(role as any)
    ) {
        const user = await adminRepository.findStaffById(userID)
        if (!user) {
            return next(new UnauthorizedError('Invalid ID'))
        }
    }
    res.locals.userID = userID
    res.locals.role = role
    res.locals.email = email
    next()
}
