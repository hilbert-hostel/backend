import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'
import { HttpError } from './HttpError'

export const errorHandler: ErrorRequestHandler = async (err, _, res, __) => {
    console.log(err)
    const { message } = err
    if (err instanceof ValidationError) {
        return res.status(400).json({ message })
    } else if (err instanceof HttpError) {
        return res.status(err.code).json({ message })
    } else {
        return res.status(500).json(err)
    }
}
