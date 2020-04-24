import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { container } from './container'
import { errorHandler } from './error/errorHandler'
import { isAuthenticated } from './middlewares/isAuthenticated'
import { isCheckedIn } from './middlewares/isCheckedIn'
import { isInRoom } from './middlewares/isInRoom'
import { Router } from './router'
import { LogLevel } from './log'

const main = async () => {
    try {
        const {
            mqttClient,
            initializeDatabase,
            connectMqtt,
            logger
        } = container
        initializeDatabase()
        await connectMqtt()
        const app = express()

        if (config.NODE_ENV !== 'production') {
            app.use(cors())
        }

        app.use(express.json())
        app.use(morgan('dev'))
        app.use(
            morgan(
                (tokens, req, res) =>
                    JSON.stringify({
                        method: tokens.method(req, res),
                        url: tokens.url(req, res),
                        status: Number(tokens.status(req, res)),
                        responseTime: tokens['response-time'](req, res) + 'ms'
                    }),
                {
                    stream: {
                        async write(message) {
                            try {
                                const data = JSON.parse(message)
                                await logger.log({
                                    level: LogLevel.INFO,
                                    time: new Date(),
                                    ...data
                                })
                            } catch (e) {
                                console.log(e)
                            }
                        }
                    },
                    skip: (req, res) => res.statusCode >= 400
                }
            )
        )
        app.use(helmet())
        app.use('/', Router)

        app.post(
            '/door/lock',
            isAuthenticated,
            isInRoom,
            isCheckedIn,
            (req, res) => {
                mqttClient.publish('door', 'lock')
                res.send('eyy')
            }
        )
        app.post(
            '/door/unlock',
            isAuthenticated,
            isInRoom,
            isCheckedIn,
            (req, res) => {
                mqttClient.publish('door', 'unlock')
                res.send('eyy')
            }
        )
        app.post(
            '/door/sound',
            isAuthenticated,
            isInRoom,
            isCheckedIn,
            (req, res) => {
                mqttClient.publish('door', 'sound')
                res.send('eyy')
            }
        )
        app.use(errorHandler)
        app.listen(config.PORT, () =>
            console.log(`listening on port ${config.PORT}`)
        )
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

main()
