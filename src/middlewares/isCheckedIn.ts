import { RequestHandler } from 'express'
import { container } from '../container'
import { UnauthorizedError } from '../error/HttpError'

export const isCheckedIn: RequestHandler = async (req, res, next) => {
    const user = await container.guestRepository.findOneById(res.locals.userID)
    if (user?.firstname === 'hilbert') next()
    else next(new UnauthorizedError('back off'))
}
