import { asFunction, asValue, createContainer, Resolver } from 'awilix'
import {
    CreateUser,
    GenerateJWT,
    Login,
    makeCreateUser,
    makeGenerateJWT,
    makeLogin,
    makeVerifyJWT,
    VerifyJWT
} from './auth/auth.service'
import { config, Config } from './config'
import { InitializeDatabase, makeInitializeDatabase } from './db'

export interface Dependencies {
    config: Config
    generateJWT: GenerateJWT
    verifyJWT: VerifyJWT
    createUser: CreateUser
    login: Login
    initializeDatabase: InitializeDatabase
}

type RegisterDeps<T> = {
    [P in keyof T]: Resolver<T[P]>
}

export const dependencies: RegisterDeps<Dependencies> = {
    config: asValue(config),
    generateJWT: asFunction(makeGenerateJWT),
    verifyJWT: asFunction(makeVerifyJWT),
    createUser: asFunction(makeCreateUser),
    login: asFunction(makeLogin)
    initializeDatabase: asFunction(makeInitializeDatabase)
}

const DIContainer = createContainer()

DIContainer.register(dependencies)

export const container = DIContainer.cradle as Dependencies
