import * as Knex from 'knex'
import moment from 'moment'
import shortid from 'shortid'
import uuid from 'uuid/v4'
import { Bed } from '../models/bed'
import { Room } from '../models/room'

export async function seed(knex: Knex): Promise<any> {
    // Deletes ALL existing entries
    await knex('room').del()
    await knex('user').del()
    await knex('reservation').del()

    // Inserts seed entries
    const rooms: Array<Omit<Room, 'beds'>> = [
        {
            id: 1,
            type: 'Double room with bathroom',
            price: 1500,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'shower',
                'bathroom',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 2,
            type: 'Double room with bathroom',
            price: 1500,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'shower',
                'bathroom',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 3,
            type: 'Double room with no bathroom',
            price: 1000,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 4,
            type: 'Double room with no bathroom',
            price: 1000,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 5,
            type: 'Double room with no bathroom',
            price: 1000,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 6,
            type: 'Triple room with bathroom',
            price: 2000,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'shower',
                'bathroom',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 7,
            type: 'Triple Room with no bathroom',
            price: 1500,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 8,
            type: 'Triple Room with no bathroom',
            price: 1500,
            facilities: [
                'hair dryer',
                'toiletries',
                'towels',
                'telephone',
                'TV',
                'air conditioning',
                'free bottled water',
                'closet',
                'clothes rack'
            ]
        },
        {
            id: 9,
            type: 'Bunk Bed in Female Dormitory Room',
            price: 500,
            facilities: ['towels', 'TV', 'air conditioning', 'closet']
        },
        {
            id: 10,
            type: 'Bunk Bed in Mixed Dormitory Room',
            price: 500,
            facilities: ['towels', 'TV', 'air conditioning', 'closet']
        },
        {
            id: 11,
            type: 'Bunk Bed in Mixed Dormitory Room',
            price: 500,
            facilities: ['towels', 'TV', 'air conditioning', 'closet']
        }
    ]
    if (rooms.length !== 11) throw new Error('should have 11 rooms')
    const doubleBathRoomBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 1
        },
        {
            room_id: 1
        },
        {
            room_id: 2
        },
        {
            room_id: 2
        }
    ]
    if (doubleBathRoomBeds.length !== 4)
        throw new Error('should have 4 double room with bathroom beds')
    const doubleNoBathRoomBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 3
        },
        {
            room_id: 3
        },
        {
            room_id: 4
        },
        {
            room_id: 4
        },
        {
            room_id: 5
        },
        {
            room_id: 5
        }
    ]
    if (doubleNoBathRoomBeds.length !== 6)
        throw new Error('should have 6 double room with no bathroom beds')

    const tripleBathRoomBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 6
        },
        {
            room_id: 6
        },
        {
            room_id: 6
        }
    ]
    if (tripleBathRoomBeds.length !== 3)
        throw new Error('should have 3 triple room with bathroom beds')

    const tripleNoBathRoomBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 7
        },
        {
            room_id: 7
        },
        {
            room_id: 7
        },
        {
            room_id: 8
        },
        {
            room_id: 8
        },
        {
            room_id: 8
        }
    ]
    if (tripleNoBathRoomBeds.length !== 6)
        throw new Error('should have 6 triple room with no bathroom beds')

    const femaleDormBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        },
        {
            room_id: 9
        }
    ]
    if (femaleDormBeds.length !== 10)
        throw new Error('should have 10 female dorm beds')

    const mixedDormBeds: Array<Omit<Bed, 'id'>> = [
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 10
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        },
        {
            room_id: 11
        }
    ]
    if (mixedDormBeds.length !== 20)
        throw new Error('should have 20 mixed dorm beds')

    const beds = ([] as Array<Omit<Bed, 'id'>>)
        .concat(
            doubleBathRoomBeds,
            doubleNoBathRoomBeds,
            tripleBathRoomBeds,
            tripleNoBathRoomBeds,
            femaleDormBeds,
            mixedDormBeds
        )
        .map((bed, i) => ({ id: i + 1, ...bed }))
    await knex('room').insert(
        rooms.map(r => ({ ...r, facilities: JSON.stringify(r.facilities) }))
    )
    await knex('bed').insert(beds)
    const user_id = uuid()
    await knex('user')
        .returning(['id'])
        .insert({
            id: user_id,
            email: 'yamarashi@email.com',
            password: 'YamaKung69',
            firstname: 'F',
            lastname: 'W',
            national_id: '111111111111',
            phone: '000000000',
            address: 'here'
        })
    const check_in = moment().add(1, 'day')
    const check_out = moment().add(3, 'day')
    const reservation_id = shortid()
    await knex('reservation')
        .returning(['id'])
        .insert({
            id: reservation_id,
            check_in,
            check_out
        })
    await knex('reservation_member').insert({ reservation_id, user_id })
    return await knex('reserved_bed').insert([
        { reservation_id, bed_id: 1 },
        { reservation_id, bed_id: 2 },
        { reservation_id, bed_id: 3 },
        { reservation_id, bed_id: 4 },
        { reservation_id, bed_id: 5 }
    ])
}
