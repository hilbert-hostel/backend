import { RequestHandler } from 'express'

export const isInRoom: RequestHandler = (req, res, next) => {
    next()
}
