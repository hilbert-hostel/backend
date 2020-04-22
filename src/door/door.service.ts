import * as crypto from 'crypto'
import { MqttClient } from 'mqtt'
import { Dependencies } from '../container'
import { BadRequestError } from '../error/HttpError'
import { IGuestRepository } from '../guest/guest.repository'
import {
    DoorLockCodeDecodeInput,
    DoorLockCodeEncodeInput
} from './door.interface'

export interface IDoorLockCodeService {
    getDoorLockInput(
        userID: string,
        roomID: string
    ): Promise<DoorLockCodeEncodeInput>
    dynamicTruncationFn(hmacValue: Buffer): number
    generateHOTP(secret: string, counter: number): number
    generateTOTP(secret: string, window: number): number
    encode(input: DoorLockCodeEncodeInput): string
    verify(input: DoorLockCodeDecodeInput, roomID: string): boolean
    unlockDoor(roomID: string): void
}

export class DoorLockCodeService implements IDoorLockCodeService {
    private readonly guestRepository: IGuestRepository
    private readonly mqttClient: MqttClient
    constructor({
        guestRepository,
        mqttClient
    }: Dependencies<IGuestRepository | MqttClient>) {
        this.guestRepository = guestRepository
        this.mqttClient = mqttClient
    }

    dynamicTruncationFn(hmacValue: Buffer) {
        const offset = hmacValue[hmacValue.length - 1] & 0xf

        return (
            ((hmacValue[offset] & 0x7f) << 24) |
            ((hmacValue[offset + 1] & 0xff) << 16) |
            ((hmacValue[offset + 2] & 0xff) << 8) |
            (hmacValue[offset + 3] & 0xff)
        )
    }

    generateHOTP(secret: string, counter: number) {
        const decodedSecret = Buffer.from(secret, 'base64')
        const buffer = Buffer.alloc(8)
        for (let i = 0; i < 8; i++) {
            buffer[7 - i] = counter & 0xff
            counter = counter >> 8
        }
        const hmac = crypto.createHmac('sha1', Buffer.from(decodedSecret))
        hmac.update(buffer)
        const hmacResult = hmac.digest()
        const code = this.dynamicTruncationFn(hmacResult)
        return code % 10 ** 6 // 6 digit HOTP
    }

    generateTOTP(secret: string, window = 0) {
        const counter = Math.floor(Date.now() / 1000) // new code generated every 1 second per window
        return this.generateHOTP(secret, counter + window)
    }

    async getDoorLockInput(userID: string, roomID: string) {
        const user = await this.guestRepository.findOneById(userID)
        if (!user)
            throw new BadRequestError('Request failed. User ID is invalid.')
        const secret = this.generateTOTP(
            userID + roomID.padStart(4, '0') + user.national_id,
            300
        ).toString() // valid for 300 windows
        return {
            userID: userID,
            roomID: roomID.padStart(4, '0'),
            nationalID: user.national_id,
            secret: secret.padStart(6, '0')
        }
    }

    encode(input: DoorLockCodeEncodeInput) {
        return (
            input.userID +
            '|' +
            input.roomID +
            '|' +
            input.nationalID +
            '|' +
            input.secret
        )
    }

    verify(input: DoorLockCodeDecodeInput, roomID: string) {
        const [userID, decodedRoomID, nationalID, totp] = input.code.split('|')
        // not staff and not match room
        if (decodedRoomID !== '9999' && decodedRoomID !== roomID) {
            return false;
        }
        const totpNumber = Number(totp)
        const secret = userID + decodedRoomID + nationalID
        for (let errorWindow = 1; errorWindow <= 300; errorWindow++) {
            const calculatedTotp = this.generateTOTP(secret, errorWindow)
            if (calculatedTotp === totpNumber) {
                return true
            }
        }
        return false
    }

    unlockDoor(roomID: string) {
        this.mqttClient.publish(`door/${roomID}`, 'unlock')
    }
}
