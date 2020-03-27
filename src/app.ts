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
import { timeoutPromise } from './utils'

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const main = async () => {
    const { mqttClient, initializeDatabase, connectMqtt } = container
    initializeDatabase()
    await connectMqtt()
    const app = express()

    if (config.NODE_ENV !== 'production') {
        app.use(cors())
    }

    app.use(express.json())
    app.use(morgan('dev'))
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
            mqttClient.publish('qrCode', 'sound')
            res.send('eyy')
        }
    )
    mqttClient.subscribe('qrCode', err => {
        if (err) console.log('qrCode sub err : ' + err)
    })

    mqttClient.subscribe('doorStatus', err => {
        if (err) console.log('doorStatus sub err : ' + err)
    })

    mqttClient.on('message', (topic, message) => {
        switch (topic) {
            //Door1
            case 'qrCode': {
                //Validate QR code
                if (message.toString() == '20021603185150') {
                    console.log('door : unlock')
                    mqttClient.publish('door', 'unlock')
                }
            }
            default:
                console.log(topic, message.toString())
        }
    })

    app.use(errorHandler)
    app.listen(config.PORT, () =>
        console.log(`listening on port ${config.PORT}`)
    )
}

main()
