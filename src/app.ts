import bodyParser from 'body-parser'
import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import config from './config'
import { initializeDatabase } from './db'
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(helmet())
app.get('/ping', (req, res) => {
    res.json({
        message: 'pong'
    })
})

initializeDatabase('pg', config.POSTGRES_URI)

app.listen(config.PORT, () => console.log(`listening on port ${config.PORT}`))
