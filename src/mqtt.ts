import mqtt, { MqttClient } from 'mqtt'
import { Config } from './config'
import { Dependencies } from './container'

export const mqttClient = ({ config }: Dependencies<Config>) => {
    const client = mqtt.connect(config.MQTT_HOST, {
        port: Number(config.MQTT_PORT),
        username: config.MQTT_USERNAME,
        password: config.MQTT_PASWORD
    })
    return client
}

export type ConnectMqtt = () => Promise<void>
export const connectMqtt = ({ mqttClient }: Dependencies<MqttClient>) => () =>
    new Promise<void>(resolve => {
        mqttClient.on('connect', () => {
            console.log('connected to mqtt broker')
            resolve()
        })
    })
