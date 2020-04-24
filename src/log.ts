import { Dependencies } from './container'
import { Config } from './config'
import axios from 'axios'
import moment from 'moment'
export const enum LogLevel {
    INFO = 'INFO',
    ERROR = 'ERROR'
}
interface LogFormat {
    from: string
    level: LogLevel
    timestamp: number
    [key: string]: any
}

export interface InfoLog {
    level: LogLevel.INFO
    time: Date
    method: string
    url: string
    status: number
    responseTime: string
}

export interface ErrorLog {
    level: LogLevel.ERROR
    time: Date
    method: string
    url: string
    stack: string
    query: any
    body: any
    params: any
}

export interface ILogger {
    log(message: InfoLog | ErrorLog): any
}

export class Logger implements ILogger {
    private readonly url: string
    constructor({ config }: Dependencies<Config>) {
        this.url = config.LOG_URL
    }

    log(message: InfoLog | ErrorLog) {
        const formatted: LogFormat = {
            ...message,
            from: 'backend',
            timestamp: moment().unix()
        }
        return axios.post(this.url, formatted)
    }
}
