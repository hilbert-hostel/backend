import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return await knex.schema.alterTable('reserved_bed', table => {
        table.primary(['reservation_id', 'bed_id'])
    })
}

export async function down(knex: Knex): Promise<any> {
    return await knex.schema.alterTable('reserved_bed', table => {
        table.dropPrimary('reservation_id')
        table.dropPrimary('bed_id')
    })
}
