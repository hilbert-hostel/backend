import VerificationTokenModel, {
    VerificationToken
} from '../models/verification_token'

export interface CreateVerificationToken {
    guest_id: string
    token: string
}
export type FindVerificationToken = CreateVerificationToken
export interface IVerificationTokenRepository {
    create(data: CreateVerificationToken): Promise<VerificationToken>
    findOne(
        condition: FindVerificationToken
    ): Promise<VerificationToken | undefined>
}
export class VerificationTokenRepository
    implements IVerificationTokenRepository {
    create(data: CreateVerificationToken) {
        return VerificationTokenModel.query().insert(data)
    }

    findOne(condition: FindVerificationToken) {
        return VerificationTokenModel.query().findOne(condition)
    }
}
