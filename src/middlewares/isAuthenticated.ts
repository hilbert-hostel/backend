import { RequestHandler } from 'express'
import { Bearer } from 'permit'
import { container } from '../container'

const permit = new Bearer({})
export const isAuthenticated: RequestHandler = async (req, res, next) => {
    const token = permit.check(req)
    if (!token) {
        permit.fail(res)
        return next(new Error(`Authentication required!`))
    }
    const { userID } = await container.jwtService.verifyToken(token)
    if (!userID) {
        permit.fail(res)
        return next(new Error(`Authentication required!`))
    }
    res.locals.userID = userID
    next()
}
