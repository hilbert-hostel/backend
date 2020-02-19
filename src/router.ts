import { Router } from 'express'
import { AuthRouter } from './auth/auth.router'

const router = Router()

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    })
})
router.use('/auth', AuthRouter)

export { router as Router }
