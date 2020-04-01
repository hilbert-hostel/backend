import * as Knex from 'knex'
// move otp to a new entitity because it needs reference code
export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable('reservation', table => {
        table.dropColumn('otp')
    })
    return await knex.schema.createTable('otp', table => {
        table
            .string('id')
            .primary()
            .references('reservation.id')
        table.string('password').notNullable()
        table.string('reference_code').notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('otp')
    await knex.schema.alterTable('reservation', table => {
        table.string('otp').nullable()
    })
}
