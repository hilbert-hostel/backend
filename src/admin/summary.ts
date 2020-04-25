import { ReservationInfoDatabase, Summary } from './admin.interface'
import moment from 'moment'

export const generateSummary = (
    reservations: ReservationInfoDatabase[],
    from: Date,
    to: Date,
    totalBeds: number
): Summary => {
    const revenue = calculateTotalRevenue(reservations, from, to)
    const utilization = calculateUtilization(reservations, from, to, totalBeds)
    const guests = calculateGuests(reservations)
    return {
        revenue,
        utilization,
        guests,
        from,
        to
    }
}

export const calculateStartEnd = (
    reservation: ReservationInfoDatabase,
    from: Date,
    to: Date
) => {
    const start = moment(from).isAfter(reservation.check_in)
        ? from
        : reservation.check_in
    const end = moment(to).isBefore(reservation.check_out)
        ? to
        : reservation.check_out
    return {
        start,
        end
    }
}
const calculateRevenue = (
    reservation: ReservationInfoDatabase,
    from: Date,
    to: Date
) => {
    const { start, end } = calculateStartEnd(reservation, from, to)
    const reservedTotal = moment(reservation.check_out).diff(
        reservation.check_in,
        'days'
    )

    const actualTotal = moment(end).diff(start, 'days')
    const percentage = actualTotal / reservedTotal
    const reservedRevenue = reservation.transaction?.amount ?? 0
    const revenue = reservedRevenue * percentage

    return revenue
}
const calculateTotalRevenue = (
    reservations: ReservationInfoDatabase[],
    from: Date,
    to: Date
) =>
    reservations
        .map(r => calculateRevenue(r, from, to))
        .reduce((acc, cur) => acc + cur, 0)

const calculateUtilization = (
    reservations: ReservationInfoDatabase[],
    from: Date,
    to: Date,
    totalBeds: number
) => {
    const reservedTotalBedNight = reservations
        .map(r => {
            const { start, end } = calculateStartEnd(r, from, to)
            const totalNights = moment(end).diff(start, 'days')
            const totalBeds = r.rooms.reduce(
                (acc, cur) => acc + cur.beds.length,
                0
            )
            const bedNight = totalBeds + totalNights
            return bedNight
        })
        .reduce((acc, cur) => acc + cur, 0)
    const totalCapacity = moment(to).diff(from, 'days') * totalBeds
    const utilization = reservedTotalBedNight / totalCapacity
    return utilization
}

const calculateGuests = (reservations: ReservationInfoDatabase[]) =>
    reservations
        .map(r => {
            const totalBeds = r.rooms.reduce(
                (acc, cur) => acc + cur.beds.length,
                0
            )
            return totalBeds
        })
        .reduce((acc, cur) => acc + cur, 0)
