import mqtt, { MqttClient } from 'mqtt'
import { Config } from './config'
import { Dependencies } from './container'
import { timeoutPromise } from './utils'

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
    timeoutPromise(
        new Promise<void>((resolve, reject) => {
            console.log('connecting to mqtt broker')
            mqttClient.on('connect', () => {
                console.log('connected to mqtt broker')
                resolve()
            })
        }),
        10000,
        'Connection to mqtt broker timed out.'
    )
