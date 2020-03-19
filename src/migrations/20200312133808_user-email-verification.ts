import * as Knex from 'knex'

export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable('user', table => {
        table.boolean('is_verified').defaultTo(false)
    })
    return await knex.schema.createTable('verification_token', table => {
        table
            .uuid('id')
            .notNullable()
            .primary()
        table.uuid('user_id').notNullable()
        table.string('token').notNullable()
        table.foreign('user_id').references('user.id')
    })
}

export async function down(knex: Knex): Promise<any> {}
