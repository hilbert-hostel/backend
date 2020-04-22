import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('guest_reservation_room', table => {
        table
            .string('guest_email')
            .references('guest.email')
            .onDelete('CASCADE')
            .notNullable()
        table
            .string('reservation_id')
            .references('reservation.id')
            .onDelete('CASCADE')
            .notNullable()
        table
            .integer('room_id')
            .references('room.id')
            .onDelete('CASCADE')
            .notNullable()
        table.primary(['guest_email', 'reservation_id', 'room_id'])
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('guest_reservation_room')
}
