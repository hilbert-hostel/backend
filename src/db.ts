import Knex from 'knex'
import { Model } from 'objection'

export const initializeDatabase = (client: string, connection: string) => {
    const knex = Knex({
        client,
        connection
    })

    Model.knex(knex)
}
