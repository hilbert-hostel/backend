import { asClass, asFunction, asValue, createContainer, Resolver } from 'awilix'
import { AuthService, IAuthService } from './auth/auth.service'
import { IJwtService, JwtService } from './auth/jwt.service'
import { config, Config } from './config'
import { InitializeDatabase, makeInitializeDatabase } from './db'
import { IUserRepository, UserRepository } from './user/user.repository'

export interface AllDependencies {
    config: Config
    userRepository: IUserRepository
    jwtService: IJwtService
    authService: IAuthService
    initializeDatabase: InitializeDatabase
}

type RegisterDeps<T> = {
    [P in keyof T]: Resolver<T[P]>
}

export const dependencies: RegisterDeps<AllDependencies> = {
    config: asValue(config),
    userRepository: asClass(UserRepository),
    jwtService: asClass(JwtService),
    authService: asClass(AuthService),
    initializeDatabase: asFunction(makeInitializeDatabase)
}

const DIContainer = createContainer()

DIContainer.register(dependencies)

export const container = DIContainer.cradle as AllDependencies

type SubType<Base, Condition> = Pick<
    Base,
    {
        [Key in keyof Base]: Base[Key] extends Condition ? Key : never
    }[keyof Base]
>

export type Dependencies<Types> = SubType<AllDependencies, Types>
