import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable('reservation', table => {
        table.index('check_in')
        table.index('check_in_enter_time')
        table.index('check_out')
        table.index('check_out_exit_time')
    })
    await knex.schema.alterTable('maintenance', table => {
        table.index('from')
        table.index('to')
    })
    await knex.schema.alterTable('guest', table => {
        table.index('email')
        table.index('national_id')
    })
    return knex.schema.alterTable('staff', table => {
        table.index('email')
    })
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.alterTable('reservation', table => {
        table.dropIndex('check_in')
        table.dropIndex('check_in_enter_time')
        table.dropIndex('check_out')
        table.dropIndex('check_out_exit_time')
    })
    await knex.schema.alterTable('maintenance', table => {
        table.dropIndex('from')
        table.dropIndex('to')
    })
    await knex.schema.alterTable('guest', table => {
        table.dropIndex('email')
        table.dropIndex('national_id')
    })
    return knex.schema.alterTable('staff', table => {
        table.dropIndex('email')
    })
}
