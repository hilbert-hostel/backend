import * as Knex from 'knex'
// move facilities and photos to new entities.
// remove add ons
// rename table user to guest and update references
// add check in enter time & check out exit time to reservation
// add record and transaction entities
// remove reservation member
export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable('facility', table => {
        table.string('name').primary()
        table.string('description').nullable()
    })
    await knex.schema.createTable('room_facility_pair', table => {
        table.integer('count')
        table.integer('room_id').references('room.id').onDelete('CASCADE')
        table
            .string('facility_name')
            .references('facility.name')
            .onDelete('CASCADE')
        table.primary(['room_id', 'facility_name'])
    })
    await knex.schema.alterTable('room', table => {
        table.dropColumn('facilities')
    })
    await knex.schema.createTable('room_photo', table => {
        table.increments('id').primary()
        table.string('photo_url').notNullable()
        table.string('photo_description').nullable()
        table.integer('room_id').references('room.id').onDelete('CASCADE')
    })
    await knex.schema.renameTable('user', 'guest')
    await knex.schema.alterTable('reservation', table => {
        table.dropForeign(['user'])
        table.renameColumn('user', 'guest_id')
        table.foreign('guest_id').references('guest.id').onDelete('CASCADE')
    })
    await knex.schema.alterTable('verification_token', table => {
        table.dropForeign(['user_id'])
        table.renameColumn('user_id', 'guest_id')
        table.foreign('guest_id').references('guest.id').onDelete('CASCADE')
    })
    await knex.schema.alterTable('reservation', table => {
        table.dropColumn('add_ons')
        table.dateTime('check_in_enter_time').nullable()
        table.dateTime('check_out_exit_time').nullable()
        table.string('otp').nullable()
    })
    await knex.schema.createTable('record', table => {
        table.uuid('id').primary()
        table.string('photo').notNullable()
        table.json('id_card_data').notNullable()
        table
            .string('reservation_id')
            .references('reservation.id')
            .onDelete('CASCADE')
    })
    await knex.schema.createTable('transaction', table => {
        table.string('id').primary()
        table.date('created_at').notNullable()
        table.string('method').notNullable()
        table.float('amount').notNullable()
        table
            .string('reservation_id')
            .references('reservation.id')
            .onDelete('CASCADE')
    })
    return await knex.schema.dropTableIfExists('reservation_member')
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTableIfExists('transaction')
    await knex.schema.dropTableIfExists('record')
    await knex.schema.renameTable('guest', 'user')
    await knex.schema.alterTable('reservation', table => {
        table.dropColumns('otp', 'check_out_exit_time', 'check_in_enter_time')
        table.string('add_ons')
        table.dropForeign(['guest'])
        table.renameColumn('guest', 'user')
        table.foreign('user').references('user.id').onDelete('CASCADE')
    })
    await knex.schema.alterTable('verification_token', table => {
        table.dropForeign(['guest_id'])
        table.renameColumn('guest_id', 'user_id')
        table.foreign('user_id').references('user.id').onDelete('CASCADE')
    })
    await knex.schema.dropTableIfExists('room_photo')
    await knex.schema.alterTable('room', table => {
        table.json('facilities')
    })
    await knex.schema.dropTableIfExists('room_facility_pair')
    await knex.schema.dropTableIfExists('facility')
    return await knex.schema.createTable('reservation_member', table => {
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
