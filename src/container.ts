import {
    asClass,
    asFunction,
    asValue,
    createContainer,
    Lifetime,
    Resolver
} from 'awilix'
import { MqttClient } from 'mqtt'
import { AdminRepository, IAdminRespository } from './admin/admin.repository'
import { AdminService, IAdminService } from './admin/admin.service'
import { AuthService, IAuthService } from './auth/auth.service'
import { IJwtService, JwtService } from './auth/jwt.service'
import {
    IVerificationTokenRepository,
    VerificationTokenRepository
} from './auth/verificationToken.repository'
import {
    CheckInRepository,
    ICheckInRepository
} from './checkIn/checkIn.repository'
import { CheckInService, ICheckInService } from './checkIn/checkIn.service'
import {
    CheckOutRepository,
    ICheckOutRepository
} from './checkOut/checkOut.repository'
import { CheckOutService, ICheckOutService } from './checkOut/checkOut.service'
import { config, Config } from './config'
import { InitializeDatabase, makeInitializeDatabase } from './db'
import { DoorLockCodeService, IDoorLockCodeService } from './door/door.service'
import { IRoomRepository, RoomRepository } from './door/room.repository'
import { IRoomService, RoomService } from './door/room.service'
import { FileService, IFileService } from './files/file.service'
import { GuestRepository, IGuestRepository } from './guest/guest.repository'
import { GuestService, IGuestService } from './guest/guest.service'
import { ILogger, Logger } from './log'
import { IMailService, MailService } from './mail/mail.service'
import { connectMqtt, ConnectMqtt, mqttClient } from './mqtt'
import {
    IPaymentRepository,
    PaymentRepository
} from './reservation/payment/payment.repository'
import {
    IPaymentService,
    SCBPaymentService
} from './reservation/payment/payment.service'
import {
    IReservationRepository,
    ReservationRepository
} from './reservation/reservation.repository'
import {
    IReservationService,
    ReservationService
} from './reservation/reservation.service'

export interface AllDependencies {
    config: Config
    initializeDatabase: InitializeDatabase
    guestRepository: IGuestRepository
    guestService: IGuestService
    verificationTokenRepository: IVerificationTokenRepository
    jwtService: IJwtService
    authService: IAuthService
    reservationRepository: IReservationRepository
    reservationService: IReservationService
    paymentRepository: IPaymentRepository
    paymentService: IPaymentService
    mqttClient: MqttClient
    connectMqtt: ConnectMqtt
    mailService: IMailService
    fileService: IFileService
    checkInRepository: ICheckInRepository
    checkInService: ICheckInService
    checkOutRespository: ICheckOutRepository
    checkOutService: ICheckOutService
    adminRepository: IAdminRespository
    adminService: IAdminService
    doorlockCodeService: IDoorLockCodeService
    roomRepository: IRoomRepository
    roomService: IRoomService
    logger: ILogger
}

type RegisterDeps<T> = {
    [P in keyof T]: Resolver<T[P]>
}

const DIContainer = createContainer()

const dependencies: RegisterDeps<AllDependencies> = {
    config: asValue(config),
    initializeDatabase: asFunction(makeInitializeDatabase),
    guestRepository: asClass(GuestRepository),
    guestService: asClass(GuestService),
    verificationTokenRepository: asClass(VerificationTokenRepository),
    jwtService: asClass(JwtService),
    authService: asClass(AuthService),
    reservationRepository: asClass(ReservationRepository),
    reservationService: asClass(ReservationService),
    paymentRepository: asClass(PaymentRepository),
    paymentService: asClass(SCBPaymentService),
    mqttClient: asFunction(mqttClient, { lifetime: Lifetime.SINGLETON }),
    connectMqtt: asFunction(connectMqtt),
    mailService: asClass(MailService),
    fileService: asClass(FileService),
    checkInRepository: asClass(CheckInRepository),
    checkInService: asClass(CheckInService),
    checkOutRespository: asClass(CheckOutRepository),
    checkOutService: asClass(CheckOutService),
    adminRepository: asClass(AdminRepository),
    adminService: asClass(AdminService),
    doorlockCodeService: asClass(DoorLockCodeService),
    roomRepository: asClass(RoomRepository),
    roomService: asClass(RoomService),
    logger: asClass(Logger)
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
