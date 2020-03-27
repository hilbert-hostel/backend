import { Router } from 'express'
import { omit } from 'ramda'
import { container } from '../container'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { validateBody, validatQuery } from '../middlewares/validate'
import {
    LoginInput,
    LoginPayload,
    RegisterInput,
    RegisterPayload,
    VerifyUserInput
} from './auth.interface'
import {
    loginValidator,
    registerValidator,
    verifyUserValidator
} from './auth.validation'

const router = Router()
const { authService, jwtService, guestRepository } = container

router.post('/register', validateBody(registerValidator), async (req, res) => {
    const input = req.body as RegisterInput
    const user = await authService.registerUser(input)
    const token = await jwtService.generateToken(user.id)
    const verificationToken = await authService.createVerificationToken(user.id)
    authService
        .sendVerificationEmail(user, verificationToken.token)
        .catch(console.log)
    const payload: RegisterPayload = { user: omit(['password'], user), token }
    res.json(payload)
})

router.post('/login', validateBody(loginValidator), async (req, res) => {
    const input = req.body as LoginInput
    const user = await authService.login(input)
    const token = await jwtService.generateToken(user.id)
    const payload: LoginPayload = { user: omit(['password'], user), token }
    res.json(payload)
})

router.get('/ping', isAuthenticated, async (req, res) => {
    const user = await guestRepository.findOneById(res.locals.userID)
    res.json(omit(['password'], user))
})

router.get('/verify', validatQuery(verifyUserValidator), async (req, res) => {
    const { userID, token } = req.query as VerifyUserInput
    const user = await authService.verifyGuest(userID, token)
    res.send(user)
})

export { router as AuthRouter }
