import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { container } from './container'
import { errorHandler } from './error/errorHandler'
import { Router } from './router'

container.initializeDatabase()

const app = express()
if (config.NODE_ENV !== 'production') {
    app.use(cors())
}
app.use(express.json())
app.use(morgan('dev'))
app.use(helmet())
app.use('/', Router)
app.use(errorHandler)
app.listen(config.PORT, () => console.log(`listening on port ${config.PORT}`))
