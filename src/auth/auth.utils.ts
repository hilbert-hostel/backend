export const randomNumString = (length: number) => {
    if (length <= 0) throw new Error('Number length must be more than 0.')
    let result = ''
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10)
    }
    return result
}
