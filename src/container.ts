import { asClass, asFunction, asValue, createContainer, Resolver } from 'awilix'
import {
    GenerateJWT,
    Login,
    makeGenerateJWT,
    makeLogin,
    makeRegisterUser,
    makeVerifyJWT,
    RegisterUser,
    VerifyJWT
} from './auth/auth.service'
import { config, Config } from './config'
import { InitializeDatabase, makeInitializeDatabase } from './db'
import { UserRepository } from './user/user.repository'

export interface Dependencies {
    config: Config
    userRepository: UserRepository
    generateJWT: GenerateJWT
    verifyJWT: VerifyJWT
    registerUser: RegisterUser
    login: Login
    initializeDatabase: InitializeDatabase
}

type RegisterDeps<T> = {
    [P in keyof T]: Resolver<T[P]>
}

export const dependencies: RegisterDeps<Dependencies> = {
    config: asValue(config),
    userRepository: asClass(UserRepository),
    generateJWT: asFunction(makeGenerateJWT),
    verifyJWT: asFunction(makeVerifyJWT),
    registerUser: asFunction(makeRegisterUser),
    login: asFunction(makeLogin),
    initializeDatabase: asFunction(makeInitializeDatabase)
}

const DIContainer = createContainer()

DIContainer.register(dependencies)

export const container = DIContainer.cradle as Dependencies
