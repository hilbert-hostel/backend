import * as jwt from 'jsonwebtoken'
import { Dependencies } from '../container'
import { User } from '../models/user.model'
import { Token, TokenPayload } from './auth.interface'

export interface IJwtService {
    generateToken(user: User): Promise<Token>
    verifyToken(token: string): Promise<TokenPayload>
}

export class JwtService implements IJwtService {
    private readonly secret: string
    constructor({ config }: Dependencies) {
        this.secret = config.SECRET
    }

    generateToken(user: User): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                { userID: user.id } as TokenPayload,
                this.secret,
                (err, token) => (err ? reject(err) : resolve(token))
            )
        })
    }

    verifyToken(token: string): Promise<TokenPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.secret, (err, token) =>
                err ? reject(err) : resolve(token as TokenPayload)
            )
        })
    }
}
