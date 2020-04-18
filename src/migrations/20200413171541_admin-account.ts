import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable('reservation', (table) => {
        table.uuid('guest_id').notNullable().alter()
    })
    return await knex.schema.createTable('staff', (table) => {
        table.uuid('id').primary()
        table.text('email').unique().notNullable()
        table.text('password').notNullable()
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
        table.text('address').nullable()
        table.text('phone').notNullable()
        table.enum('role', [
            'ADMIN',
            'MANAGER',
            'ROLE',
            'RECEPTIONIST',
            'CLEANER'
        ])
    })
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.alterTable('reservation', (table) => {
        table.uuid('guest_id').nullable().alter()
    })
    return await knex.schema.dropTable('staff')
}
