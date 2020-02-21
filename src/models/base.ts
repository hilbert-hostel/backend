import { Model } from 'objection'

export default class BaseModel extends Model {
    updatedAt!: string
    createdAt!: string
    static get modelPaths() {
        return [__dirname]
    }
    $beforeUpdate() {
        this.updatedAt = new Date().toISOString()
    }

    $beforeInsert() {
        this.createdAt = new Date().toISOString()
    }
}
