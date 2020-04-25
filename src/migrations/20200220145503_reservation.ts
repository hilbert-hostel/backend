import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('user', table => {
        table.uuid('id').primary()
        table.text('username').unique().notNullable()
        table.text('email').unique().notNullable()
        table.text('password').notNullable()
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
        table.text('address').nullable()
        table.text('phone').nullable()
    })
    await knex.schema.createTable('room', table => {
        table.increments('id').primary()
        table.integer('price').notNullable()
        table.string('type').notNullable()
        table.string('description')
        table.json('facilities')
    })

    await knex.schema.createTable('bed', table => {
        table.increments('id').primary()
        table.integer('room_id')
        table.foreign('room_id').references('room.id').onDelete('CASCADE')
    })

    await knex.schema.createTable('reservation', table => {
        table.string('id').primary()
        table.date('check_in').notNullable()
        table.date('check_out').notNullable()
        table.string('add_ons')
        table.string('special_requests')
        table.dateTime('created_at')
        table.dateTime('updated_at')
        table.uuid('user')
        table.foreign('user').references('user.id').onDelete('CASCADE')
    })

    await knex.schema.createTable('reserved_bed', table => {
        table.string('reservation_id')
        table
            .foreign('reservation_id')
            .references('reservation.id')
            .onDelete('CASCADE')
        table.integer('bed_id')
        table.foreign('bed_id').references('bed.id').onDelete('CASCADE')
        table.dateTime('created_at')
        table.dateTime('updated_at')
    })

    return knex.schema.createTable('reservation_member', table => {
        table.string('reservation_id')
        table
            .foreign('reservation_id')
            .references('reservation.id')
            .onDelete('CASCADE')
        table.uuid('user_id')
        table.foreign('user_id').references('user.id').onDelete('CASCADE')
        table.dateTime('created_at')
        table.dateTime('updated_at')
    })
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTableIfExists('user')
    await knex.schema.dropTableIfExists('reservation_member')
    await knex.schema.dropTableIfExists('reserved_bed')
    await knex.schema.dropTableIfExists('reservation')
    await knex.schema.dropTableIfExists('bed')
    return await knex.schema.dropTableIfExists('room')
}
