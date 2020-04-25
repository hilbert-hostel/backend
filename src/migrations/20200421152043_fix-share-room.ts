import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return knex.schema.alterTable('guest_reservation_room', table => {
        table.dropForeign(['guest_email'])
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.alterTable('guest_reservation_room', table => {
        table
            .foreign('guest_email')
            .references('reservation.id')
            .onDelete('CASCADE')
    })
}
