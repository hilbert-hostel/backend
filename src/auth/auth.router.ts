import { Router } from 'express'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validate } from '../middlewares/validate'
import { LoginInput, RegisterInput } from './auth.interface'
import { loginValidator, registerValidator } from './auth.validation'

const router = Router()

router.post('/register', validate(registerValidator), async (req, res) => {
    const input = req.body as RegisterInput
    const user = await container.createUser(input)
    res.json(user)
})

router.post('/login', validate(loginValidator), async (req, res) => {
    const input = req.body as LoginInput
    const user = await container.login(input)
    res.json(user)
})

router.get('/ping', isAuthenticated, async (req, res) => {
    res.json(res.locals.userID)
})
export { router as AuthRouter }
