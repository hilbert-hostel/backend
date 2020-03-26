import { Model, ModelOptions, QueryContext } from 'objection'

type ModelDecorator = (
    ...args: any[]
) => <T extends { new (...args: any[]): Model }>(base: T) => T

export const GenID: ModelDecorator = <T>(idGenerator: () => T) => base =>
    class extends base {
        id!: T
        $beforeInsert(ctx: QueryContext) {
            super.$beforeInsert(ctx)
            this.id = idGenerator()
        }
    }
export const CreatedAt: ModelDecorator = () => base =>
    class extends base {
        created_at!: string

        $beforeInsert(ctx: QueryContext) {
            super.$beforeInsert(ctx)
            this.created_at = new Date().toISOString()
        }
    }
export const CreatedUpdatedAt: ModelDecorator = () => base =>
    class extends base {
        updated_at!: string
        created_at!: string

        $beforeUpdate(opt: ModelOptions, ctx: QueryContext) {
            super.$beforeUpdate(opt, ctx)
            this.updated_at = new Date().toISOString()
        }

        $beforeInsert(ctx: QueryContext) {
            super.$beforeInsert(ctx)
            this.created_at = new Date().toISOString()
        }
    }
