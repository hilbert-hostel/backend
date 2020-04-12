import { Reservation, ReservationModel } from '../models/reservation'
import { container } from '../container'
import { log } from './logstash'

const { mqttClient, initializeDatabase, connectMqtt } = container

export const validateQR = async (id: string) => {
    const reservation = await ReservationModel.query().findById(id)
    return !!reservation
}

export const checkTopic = async (topic: string, message: string) => {
    if (topic === 'qrCode') {
        if (await validateQR(message.toString())) {
            log(topic, message.toString())
            mqttClient.publish('door', 'unlock')
        } else {
            console.log('validate failed')
        }
    }
    if (topic === 'doorStatus') {
        log(topic, message.toString())
    }
}
