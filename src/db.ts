import Knex from 'knex'
import { Model } from 'objection'
import { Config } from './config'
import { Dependencies } from './container'

export type InitializeDatabase = () => void
export const makeInitializeDatabase = ({
    config
}: Dependencies<Config>) => () => {
    try {
        const knex = Knex({
            client: config.DB,
            connection: config.DB_URI
        })

        Model.knex(knex)
    } catch (e) {
        console.log(e)
    }
}
