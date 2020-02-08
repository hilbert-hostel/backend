import { RequestHandler } from 'express'
import { ObjectSchema } from 'yup'

export const validate = (schema: ObjectSchema): RequestHandler => (
    req,
    res,
    next
) => {
    schema
        .validate(req.body, { stripUnknown: true })
        .then(validated => {
            req.body = validated
            next()
        })
        .catch(next)
}
