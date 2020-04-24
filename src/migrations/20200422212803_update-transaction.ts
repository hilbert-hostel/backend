import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable('transaction', table => {
        table.boolean('paid').defaultTo(false)
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.alterTable('transaction', table => {
        table.dropColumn('paid')
    })
}
