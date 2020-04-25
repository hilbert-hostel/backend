import { ErrorRequestHandler } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ValidationError } from 'yup'
import { HttpError } from './HttpError'
import { container } from '../container'
import { LogLevel } from '../log'
import { isEmpty } from 'ramda'
const { logger } = container
export const errorHandler: ErrorRequestHandler = async (err, req, res, __) => {
    console.log(err)
    let { query, body, params } = req
    const format = (data: any) => (isEmpty(data) ? null : JSON.stringify(data))
    query = format(query)
    body = format(body)
    params = format(params) as any

    const { message } = err
    try {
        await logger.log({
            level: LogLevel.ERROR,
            time: new Date(),
            method: req.method,
            url: req.originalUrl,
            stack: err.stack,
            query,
            body,
            params
        })
    } catch (e) {
        console.log(e)
    }
    if (err instanceof ValidationError) {
        return res.status(400).json({ message })
    } else if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ message })
    } else if (err instanceof HttpError) {
        return res.status(err.code).json({ message })
    } else {
        return res.status(500).json({ message })
    }
}
