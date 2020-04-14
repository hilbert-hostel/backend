import { RequestHandler } from 'express'
import { ForbiddenError } from '../error/HttpError'

export const hasRole = (checkRole: string): RequestHandler => async (
    req,
    res,
    next
) => {
    const { role } = res.locals
    if (role !== checkRole) {
        return next(new ForbiddenError(`You do not have ${checkRole} role.`))
    }
    return next()
}
