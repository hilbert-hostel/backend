import * as dotenv from 'dotenv'

dotenv.config()
const { env } = process
export const config = {
    PORT: env.PORT as string,
    NODE_ENV: env.NODE_ENV as string,
    DB_URI: env.DB_URI as string,
    DB: env.DB as string,
    SECRET: env.SECRET as string
}

export type Config = typeof config
