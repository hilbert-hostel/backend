import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.raw('create extension if not exists "uuid-ossp"').then()

    return knex.schema.createTable('users', table => {
        table
            .uuid('id')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'))
        table
            .text('username')
            .unique()
            .notNullable()
        table
            .text('email')
            .unique()
            .notNullable()
        table.text('password').notNullable()
        table.text('firstname').notNullable()
        table.text('lastname').notNullable()
        table.text('address').nullable()
        table.text('phone').nullable()
    })
}

export async function down(knex: Knex): Promise<any> {
    await knex.schema.dropTable('users')
    return await knex.raw('drop extension if exists "uuid-ossp"')
}
