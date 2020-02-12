import { Router } from 'express'
import { AuthRouter } from './auth/auth.router'
import { DocsRouter } from './docs/docs.router'

const router = Router()

router.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    })
})
router.use('/auth', AuthRouter)
router.use('/api-docs', DocsRouter)

export { router as Router }
