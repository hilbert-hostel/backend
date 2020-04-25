import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable('maintenance', table => {
        table.increments('id').primary()
        table.dateTime('created_at').notNullable()
        table.dateTime('from').notNullable()
        table.dateTime('to').notNullable()
        table
            .integer('room_id')
            .references('room.id')
            .onDelete('CASCADE')
            .notNullable()
        table.string('description').nullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable('maintenance')
}
