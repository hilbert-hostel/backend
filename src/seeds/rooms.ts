import { hash } from 'bcryptjs'
import * as Knex from 'knex'
import moment from 'moment'
import { Model } from 'objection'
import shortid from 'shortid'
import uuid from 'uuid/v4'
import FacilityModel, { Facility } from '../models/facility'
import RoomModel from '../models/room'

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    await knex('room').del()
    await knex('guest').del()
    await knex('reservation').del()
    await knex('facility').del()
    await knex('staff').del()
    Model.knex(knex)
    // create facilities
    const facilities: Facility[] = [
        { name: 'refundable' },
        { name: 'breakfast included' },
        { name: 'wifi' },
        { name: 'air conditioner' },
        { name: 'bottled water', description: 'per person per night' },
        { name: 'shampoo', description: 'per person per night' },
        { name: 'soap', description: 'per person per night' },
        { name: 'towel', description: 'per person' }
    ]
    await FacilityModel.query().insert(facilities)
    // create rooms
    let id = 1
    const makeBeds = (amount: number): any[] => {
        const beds: any[] = []
        for (let i = 0; i < amount; i++) {
            beds.push({ id })
            id++
        }
        return beds
    }
    const mixedDormPhotos: any = [
        {
            photo_url:
                'https://www.myboutiquehotel.com/photos/106370/room-17553924-840x460.jpg'
        }
    ]
    const womenDormPhotos: any = [
        {
            photo_url:
                'https://a0.muscache.com/im/pictures/109451542/8989b537_original.jpg?aki_policy=large'
        }
    ]

    await RoomModel.query().insertGraph([
        {
            id: 1,
            price: 600,
            type: 'mixed-dorm-s',
            description: `Private room with twin-size bed with 6 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(6),
            photos: mixedDormPhotos
        },
        {
            id: 2,
            price: 600,
            type: 'mixed-dorm-s',
            description: `Private room with twin-size bed with 6 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(6),
            photos: mixedDormPhotos
        },
        {
            id: 3,
            price: 600,
            type: 'mixed-dorm-s',
            description: `Private room with twin-size bed with 6 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(6),
            photos: mixedDormPhotos
        },
        {
            id: 4,
            price: 600,
            type: 'mixed-dorm-m',
            description: `Private room with twin-size bed with 10 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(10),
            photos: mixedDormPhotos
        },
        {
            id: 5,
            price: 600,
            type: 'mixed-dorm-m',
            description: `Private room with twin-size bed with 10 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(10),
            photos: mixedDormPhotos
        },
        {
            id: 6,
            price: 600,
            type: 'mixed-dorm-l',
            description: `Private room with twin-size bed with 15 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(15),
            photos: mixedDormPhotos
        },
        {
            id: 7,
            price: 600,
            type: 'mixed-dorm-l',
            description: `Private room with twin-size bed with 15 beds in a row. Comprising more security, social life, showers, and room with multiple bunks. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(15),
            photos: mixedDormPhotos
        },
        {
            id: 8,
            price: 650,
            type: 'women-dorm-m',
            description: `Private women room with queen-size bed with 10 beds in a row. Comprising more social life, showers, room with multiple bunks and lastly, security for women. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(10),
            photos: womenDormPhotos
        },
        {
            id: 9,
            price: 650,
            type: 'women-dorm-l',
            description: `Private women room with queen-size bed with 10 beds in a row. Comprising more social life, showers, room with multiple bunks and lastly, security for women. There is air conditioning provided in every room. Also, a private bathroom and free wifi.`,
            beds: makeBeds(20),
            photos: womenDormPhotos
        }
    ])

    // connect rooms and facilities
    const makeRoomFacilityPairs = (room_id: number, facilities: any[]) =>
        facilities.map(f => ({ ...f, room_id }))
    const f = [
        {
            count: 1,
            facility_name: 'refundable'
        },
        {
            count: 1,
            facility_name: 'breakfast included'
        },
        {
            count: 1,
            facility_name: 'wifi'
        },
        {
            count: 1,
            facility_name: 'air conditioner'
        },
        {
            count: 1,
            facility_name: 'bottled water'
        },
        {
            count: 2,
            facility_name: 'shampoo'
        },
        {
            count: 2,
            facility_name: 'soap'
        },
        {
            count: 1,
            facility_name: 'towel'
        }
    ]
    const pairs = [1, 2, 3, 4, 5, 6, 7, 8, 9].reduce<any[]>(
        (acc, curr) => [...acc, ...makeRoomFacilityPairs(curr, f)],
        []
    )
    await knex('room_facility_pair').insert(pairs)

    // create guest account
    const guest_id = uuid()
    await knex('guest').insert({
        id: guest_id,
        email: 'yamarashi@email.com',
        password: await hash('YamaKung69', 10),
        firstname: 'Yamarashi',
        lastname: 'Kishisa',
        national_id: '111111111111',
        phone: '000000000',
        address: 'here',
        is_verified: true
    })
    //create admin account
    const admin_id = uuid()
    await knex('staff').insert({
        id: admin_id,
        email: 'yamarashi@email.com',
        password: await hash('YamaKung69', 10),
        firstname: 'Hilbert',
        lastname: 'Admin',
        phone: '000000000',
        address: 'here',
        role: 'ADMIN'
    })
    //create owner account
    const owner_id = uuid()
    await knex('staff').insert({
        id: owner_id,
        email: 'sarun.n@email.com',
        password: await hash('Weebs999', 10),
        firstname: 'Sarun',
        lastname: 'Cern',
        phone: '000000000',
        address: 'here',
        role: 'MANAGER'
    })
    // create reservation
    const check_in = moment().add(1, 'day')
    const check_out = moment().add(3, 'day')
    const reservation_id = shortid()
    await knex('reservation').insert({
        id: reservation_id,
        check_in,
        check_out,
        guest_id
    })
    return await knex('reserved_bed').insert([
        { reservation_id, bed_id: 1 },
        { reservation_id, bed_id: 2 },
        { reservation_id, bed_id: 3 },
        { reservation_id, bed_id: 4 },
        { reservation_id, bed_id: 5 }
    ])
}
