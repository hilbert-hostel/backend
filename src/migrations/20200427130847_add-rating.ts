import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable('reservation', table => {
        table.integer('rating').nullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.alterTable('reservation', table => {
        table.dropColumn('rating')
    })
}
