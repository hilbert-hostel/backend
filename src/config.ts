import * as dotenv from 'dotenv'

dotenv.config()
const { env } = process
const config = {
    PORT: env.PORT as string,
    NODE_ENV: env.NODE_ENV as string,
    POSTGRES_URI: env.POSTGRES_URI as string,
    SECRET: env.SECRET as string
}

export type Config = typeof config

export { config }
