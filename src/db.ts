import Knex from 'knex'
import { Model } from 'objection'
import { Config } from './config'
import { Dependencies } from './container'

export type InitializeDatabase = () => void
export const makeInitializeDatabase = ({
    config
}: Dependencies<Config>) => () => {
    const knex = Knex({
        client: config.DB,
        connection: config.DB_URI
    })

    Model.knex(knex)
}
