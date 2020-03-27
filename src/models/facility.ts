import BaseModel from './base'

export interface Facility {
    name: string
    description?: string
}
export default class FacilityModel extends BaseModel implements Facility {
    name!: string
    description?: string
    static tableName = 'facility'
}
