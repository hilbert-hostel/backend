import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { Config } from '../config'
import { Dependencies } from '../container'

interface MailOptions {
    to: string | string[]
    subject: string
    text?: string
    html?: string
}

export interface IMailService {
    sendMail(data: MailOptions): Promise<any>
}

export class MailService implements IMailService {
    private readonly mailer: Mail
    constructor({ config }: Dependencies<Config>) {
        this.mailer = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: config.MAILER_USER,
                clientId: config.MAILER_CLIENT_ID,
                clientSecret: config.MAILER_CLIENT_SECRET,
                refreshToken: config.MAILER_REFRESH_TOKEN
            }
        })
    }

    sendMail(options: MailOptions) {
        return this.mailer.sendMail(options)
    }
}
