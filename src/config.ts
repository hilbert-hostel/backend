import * as dotenv from 'dotenv'

dotenv.config()
const { env } = process
export default {
    PORT: env.PORT as string,
    NODE_ENV: env.NODE_ENV as string,
    POSTGRES_URI: env.POSTGRES_URI as string
}
