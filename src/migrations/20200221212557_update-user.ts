import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    return await knex.schema.alterTable('user', table => {
        table.dropColumn('username')
        table
            .string('national_id')
            .unique()
            .notNullable()
        table
            .string('address')
            .notNullable()
            .alter()
        table
            .string('phone')
            .notNullable()
            .alter()
    })
}

export async function down(knex: Knex): Promise<any> {}
