import { RequestHandler } from 'express'
import { ForbiddenError } from '../error/HttpError'

export const hasRole = (...checkRoles: string[]): RequestHandler => async (
    req,
    res,
    next
) => {
    const { role } = res.locals
    if (!checkRoles.includes(role)) {
        return next(
            new ForbiddenError(
                `You do not have ${checkRoles.join(' or ')} role.`
            )
        )
    }
    return next()
}
