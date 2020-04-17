import * as dotenv from 'dotenv'

dotenv.config()

const env = new Proxy(process.env as Record<string, string>, {
    get(obj, prop: string) {
        const variable = obj[prop]
        if (!variable) {
            throw new Error(`${prop} is not set in environment variables.`)
        }
        return variable
    },
})
export const config = {
    PORT: env.PORT,
    NODE_ENV: env.NODE_ENV,
    DB_URI: env.DB_URI,
    DB: env.DB,
    SECRET: env.SECRET,
    MQTT_HOST: env.MQTT_HOST,
    MQTT_PORT: env.MQTT_PORT,
    MQTT_USERNAME: env.MQTT_USERNAME,
    MQTT_PASWORD: env.MQTT_PASSWORD,
    MAILER_USER: env.MAILER_USER,
    MAILER_CLIENT_ID: env.MAILER_CLIENT_ID,
    MAILER_CLIENT_SECRET: env.MAILER_CLIENT_SECRET,
    MAILER_REFRESH_TOKEN: env.MAILER_REFRESH_TOKEN,
    BASE_URL: env.BASE_URL,
    BUCKET_ID: env.BUCKET_ID,
    BUCKET_SECRET: env.BUCKET_SECRET,
    BUCKET_NAME: env.BUCKET_NAME,
}

export type Config = typeof config
