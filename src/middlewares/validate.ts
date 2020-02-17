import { RequestHandler } from 'express'
import { ObjectSchema } from 'yup'

export const validate = (schema: ObjectSchema): RequestHandler => async (
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
