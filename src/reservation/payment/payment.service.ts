import axios from 'axios'
import { Config } from '../../config'
import { Dependencies } from '../../container'
import { BadRequestError, ForbiddenError } from '../../error/HttpError'
import { IPaymentRepository } from './payment.repository'
import { calculatePrice, formatReceiptMessage } from './payment.util'
import { IMailService } from '../../mail/mail.service'
import moment = require('moment')

export interface IPaymentService {
    makePayment(
        reservationID: string,
        guestID: string
    ): Promise<{ url: string; amount: number }>
    checkPaymentStatus(reservationID: string, guestID: string): Promise<boolean>
    updatePaymentStatus(transactionID: string): Promise<any>
    sendReceipt(transactionID: string): Promise<void>
}

interface AccessTokenPayload {
    status?: {
        code: number
        description: string
    }
    data?: {
        accessToken: string
        tokenType: 'Bearer'
        expiresIn: number
        expiresAt: number
    }
}
interface DeeplinkPayload {
    status?: {
        code: number
        description: string
    }
    data: {
        transactionId: string
        deeplinkUrl: string
        userRefId: string
    }
}
interface TransactionPayload {
    status: {
        code: number
        description: string
    }
    data: {
        statusCode: number
    }
}
export class SCBPaymentService implements IPaymentService {
    private readonly API_KEY: string
    private readonly API_SECRET: string
    private readonly BILLER_ID: string
    private readonly paymentRepository: IPaymentRepository
    private readonly baseUrl =
        'https://api-sandbox.partners.scb/partners/sandbox'
    private readonly mailService: IMailService
    constructor({
        config,
        paymentRepository,
        mailService
    }: Dependencies<Config | IPaymentRepository | IMailService>) {
        this.API_KEY = config.BANK_API_KEY
        this.API_SECRET = config.BANK_API_SECRET
        this.BILLER_ID = config.BANK_BILLER_ID
        this.paymentRepository = paymentRepository
        this.mailService = mailService
    }
    async getAccessToken(reservationID: string) {
        const payload = await axios.post<AccessTokenPayload>(
            `${this.baseUrl}/v1/oauth/token`,
            {
                applicationKey: this.API_KEY,
                applicationSecret: this.API_SECRET
            },
            {
                headers: {
                    resourceOwnerId: this.API_KEY,
                    requestUid: reservationID
                }
            }
        )
        const {
            data: { status, data }
        } = payload
        if (status?.code === 1000 && data?.accessToken) {
            return data.accessToken
        } else {
            throw new Error(JSON.stringify(payload.data))
        }
    }
    async makePayment(reservationID: string, guestID: string) {
        const reservation = await this.paymentRepository.findReservationById(
            reservationID
        )
        if (reservation.guest_id !== guestID) {
            throw new ForbiddenError(
                'Can not request payment because you did not make this reservation.'
            )
        }
        if (reservation.transaction) {
            await this.paymentRepository.deleteTransactionById(
                reservation.transaction.id
            )
        }
        const rooms = await this.paymentRepository.findRoomsInReservationById(
            reservationID
        )
        const nights = moment(reservation.check_out).diff(
            moment(reservation.check_in),
            'days'
        )

        const price = calculatePrice(rooms, nights)
        const { deeplinkUrl, transactionID } = await this.requestDeepLink(
            reservationID,
            price
        )
        await this.paymentRepository.createTransaction(
            transactionID,
            reservationID,
            price,
            'SCB'
        )
        return {
            url: deeplinkUrl,
            amount: price
        }
    }
    async requestDeepLink(reservationID: string, amount: number) {
        const accessToken = await this.getAccessToken(reservationID)
        const payload = await axios.post<DeeplinkPayload>(
            `${this.baseUrl}/v3/deeplink/transactions`,
            {
                transactionType: 'PURCHASE',
                transactionSubType: ['BP'],
                billPayment: {
                    paymentAmount: amount,
                    accountTo: this.BILLER_ID,
                    ref1: reservationID,
                    ref2: reservationID,
                    ref3: reservationID
                }
            },
            {
                headers: {
                    resourceOwnerId: this.API_KEY,
                    requestUid: reservationID,
                    Authorization: `Bearer ${accessToken}`,
                    channel: 'scbeasy'
                }
            }
        )
        const {
            data: { status, data }
        } = payload
        if (status?.code !== 1000) {
            throw new Error(JSON.stringify(payload.data))
        }
        const { deeplinkUrl, transactionId } = data
        return { deeplinkUrl, transactionID: transactionId }
    }
    async checkPaymentStatus(reservationID: string, guestID: string) {
        const reservation = await this.paymentRepository.findReservationById(
            reservationID
        )
        if (!reservation) {
            throw new BadRequestError('Invalid reservaion ID')
        }
        if (reservation.guest_id !== guestID) {
            throw new ForbiddenError(
                'Can not check payment status of this reservation because you did not make this reservation'
            )
        }
        if (!reservation.transaction) {
            return false
        }
        if (reservation.transaction.paid) {
            return true
        }
        const accessToken = await this.getAccessToken(reservationID)
        const payload = await axios.get<TransactionPayload>(
            `${this.baseUrl}/v2/transactions/${reservation.transaction.id}`,
            {
                headers: {
                    resourceOwnerId: this.API_KEY,
                    requestUid: reservationID,
                    Authorization: `Bearer ${accessToken}`
                }
            }
        )
        const {
            data: { status, data }
        } = payload
        if (status?.code !== 1000) {
            throw new Error(JSON.stringify(payload.data))
        }

        const { statusCode } = data
        if (statusCode !== 1) {
            return false
        }

        await this.paymentRepository.completeTransaction(
            reservation.transaction.id
        )
        return true
    }
    async updatePaymentStatus(transactionID: string) {
        await this.paymentRepository.completeTransaction(transactionID)
        return {
            resCode: '00',
            'resDesc ': 'success',
            transactionId: transactionID
        }
    }
    async sendReceipt(transactionID: string) {
        const reservation = await this.paymentRepository.findReservationByTransactionId(
            transactionID
        )
        const rooms = await this.paymentRepository.findRoomsInReservationById(
            reservation.id
        )
        const nights = moment(reservation.check_out).diff(
            moment(reservation.check_in),
            'days'
        )
        const price = calculatePrice(rooms, nights)
        const formattedRooms = rooms.map(r => ({
            id: r.id,
            beds: r.beds!.length
        }))
        const email = reservation.guest!.email
        const message = formatReceiptMessage({
            reservationID: reservation.id,
            transactionID,
            amount: price,
            method: 'SCB',
            checkIn: reservation.check_in,
            checkOut: reservation.check_out,
            rooms: formattedRooms,
            name: `${reservation.guest?.firstname} ${reservation.guest?.lastname}`
        })
        return this.mailService.sendMail({
            to: email,
            subject: 'Hilbert Booking Complete',
            text: message
        })
    }
}
