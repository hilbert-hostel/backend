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
        createdAt!: string

        $beforeInsert(ctx: QueryContext) {
            super.$beforeInsert(ctx)
            this.createdAt = new Date().toISOString()
        }
    }
export const CreatedUpdatedAt: ModelDecorator = () => base =>
    class extends base {
        updatedAt!: string
        createdAt!: string

        $beforeUpdate(opt: ModelOptions, ctx: QueryContext) {
            super.$beforeUpdate(opt, ctx)
            this.updatedAt = new Date().toISOString()
        }

        $beforeInsert(ctx: QueryContext) {
            super.$beforeInsert(ctx)
            this.createdAt = new Date().toISOString()
        }
    }
