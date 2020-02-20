import * as dotenv from 'dotenv'

dotenv.config()

const env = new Proxy(process.env as Record<string, string>, {
    get(obj, prop: string) {
        const variable = obj[prop]
        if (!variable) {
            throw new Error(`${prop} is not set in environment variables.`)
        }
        return variable
    }
})
export const config = {
    PORT: env.PORT,
    NODE_ENV: env.NODE_ENV,
    DB_URI: env.DB_URI,
    DB: env.DB,
    SECRET: env.SECRET
}

export type Config = typeof config
