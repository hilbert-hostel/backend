import { RequestHandler } from 'express'
import { ObjectSchema } from 'yup'

export const validateBody = (schema: ObjectSchema): RequestHandler => async (
    req,
    _,
    next
) => {
    try {
        const validated = await schema.validate(req.body, {
            stripUnknown: true
        })
        req.body = validated
        next()
    } catch (e) {
        next(e)
    }
}

export const validatQuery = (schema: ObjectSchema): RequestHandler => async (
    req,
    _,
    next
) => {
    try {
        const validated = await schema.validate(req.query, {
            stripUnknown: true
        })
        req.query = validated
        next()
    } catch (e) {
        next(e)
    }
}
