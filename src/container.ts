import {
    asClass,
    asFunction,
    asValue,
    createContainer,
    Lifetime,
    Resolver,
} from 'awilix'
import { MqttClient } from 'mqtt'
import { AuthService, IAuthService } from './auth/auth.service'
import { IJwtService, JwtService } from './auth/jwt.service'
import {
    IVerificationTokenRepository,
    VerificationTokenRepository,
} from './auth/verificationToken.repository'
import { config, Config } from './config'
import { InitializeDatabase, makeInitializeDatabase } from './db'
import { IMailService, MailService } from './email/email.service'
import { GuestRepository, IGuestRepository } from './guest/guest.repository'
import { connectMqtt, ConnectMqtt, mqttClient } from './mqtt'
import {
    IReservationRepository,
    ReservationRepository,
} from './reservation/reservation.repository'
import {
    IReservationService,
    ReservationService,
} from './reservation/reservation.service'
import { ILogService, LogService } from './doorlock/logstash'

export interface AllDependencies {
    config: Config
    initializeDatabase: InitializeDatabase
    guestRepository: IGuestRepository
    verificationTokenRepository: IVerificationTokenRepository
    jwtService: IJwtService
    authService: IAuthService
    reservationRepository: IReservationRepository
    reservationService: IReservationService
    mqttClient: MqttClient
    connectMqtt: ConnectMqtt
    mailService: IMailService
    logService: ILogService
}

type RegisterDeps<T> = {
    [P in keyof T]: Resolver<T[P]>
}

const DIContainer = createContainer()

const dependencies: RegisterDeps<AllDependencies> = {
    config: asValue(config),
    initializeDatabase: asFunction(makeInitializeDatabase),
    guestRepository: asClass(GuestRepository),
    verificationTokenRepository: asClass(VerificationTokenRepository),
    jwtService: asClass(JwtService),
    authService: asClass(AuthService),
    reservationRepository: asClass(ReservationRepository),
    reservationService: asClass(ReservationService),
    mqttClient: asFunction(mqttClient, { lifetime: Lifetime.SINGLETON }),
    connectMqtt: asFunction(connectMqtt),
    mailService: asClass(MailService),
    logService: asClass(LogService),
}

DIContainer.register(dependencies)

export const container = DIContainer.cradle as AllDependencies

type SubType<Base, Condition> = Pick<
    Base,
    {
        [Key in keyof Base]: Base[Key] extends Condition ? Key : never
    }[keyof Base]
>

export type Dependencies<Types> = SubType<AllDependencies, Types>
