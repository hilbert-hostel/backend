import { Reservation, ReservationModel } from '../models/reservation'
import { container } from '../container'
import { LogService } from './logstash'

const { mqttClient, initializeDatabase, connectMqtt, logService } = container

export const validateQR = async (id: string) => {
    const reservation = await ReservationModel.query().findById(id)
    return !!reservation
}

export const checkTopic = async (topic: string, message: string) => {
    if (topic === 'qrCode') {
        if (await validateQR(message.toString())) {
            logService.log(topic, message.toString())
            mqttClient.publish('door/1', 'unlock')
        } else {
            console.log('validate failed')
        }
    }
    if (topic === 'doorStatus') {
        logService.log(topic, message.toString())
    }
}
