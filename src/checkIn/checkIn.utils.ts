import moment from 'moment'

export const sameDay = (date1: Date, date2: Date) => {
    return moment(date1).isSame(date2, 'day')
}
