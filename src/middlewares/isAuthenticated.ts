import { RequestHandler } from 'express'
import { Bearer } from 'permit'
import { container } from '../container'
import { UnauthorizedError } from '../error/HttpError'

const permit = new Bearer({})
export const isAuthenticated: RequestHandler = async (req, res, next) => {
    const token = permit.check(req)
    if (!token) {
        permit.fail(res)
        const err = new UnauthorizedError(`Authentication is required!`)
        return next(err)
    }
    const { userID } = await container.jwtService.verifyToken(token)
    if (!userID) {
        permit.fail(res)
        return next(new UnauthorizedError(`Authentication is required!`))
    }
    res.locals.userID = userID
    next()
}
