import { string } from 'yup'
import { Config } from '../config'
import { Dependencies } from '../container'

const request = require('request')

export interface ILogService {
    log(topic: string, message: string): any
}

export interface log {
    from: string
    function: string
    message: string
}

export class LogService implements ILogService {
    private log_url: string
    constructor({ config }: Dependencies<Config>) {
        this.log_url = config.LOG_URL
    }

    log = (topic: string, message: string) => {
        if (topic === 'doorStatus') {
            const body: log = {
                from: 'mqtt',
                function: topic,
                message: message,
            }
            request.post(this.log_url, { json: body })
        }
        if (topic === 'qrCode') {
            const body: log = {
                from: 'raspberryPi',
                function: topic,
                message: message,
            }
            request.post(this.log_url, { json: body })
        }
    }
}
