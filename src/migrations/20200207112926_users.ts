import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.raw('create extension if not exists "uuid-ossp"').then()

    return knex.schema.createTable('users', table => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'))
        table
            .text('email')
            .unique()
            .notNullable()
        table.text('password').notNullable()
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    return knex.raw('drop extension if exists "uuid-ossp"')
}
