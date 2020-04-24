import { Room } from '../../models/room'

export const calculatePrice = (rooms: Room[]): number => {
    const priceOfEachRoom = rooms.map(r => r.price * (r?.beds?.length ?? 0))
    return priceOfEachRoom.reduce((acc, cur) => acc + cur, 0)
}
