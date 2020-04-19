import { Response } from 'express'
import { assoc, curry, keys, reduce } from 'ramda'

export const timeoutPromise = <T>(
    promise: Promise<T>,
    time: number,
    message: string = 'timed out'
) =>
    Promise.race<Promise<T>>([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(message)
            }, time)
        })
    ])

export const trace = <T>(i: T, ...message: any[]) => {
    console.log(JSON.stringify(i, null, 2), ...message)
    return i
}
export const getUserID = (res: Response) => res.locals.userID as string

export const renameKeys = curry(
    (keysMap: Record<string, string>, obj: Record<string, any>) =>
        reduce<string, Record<string, any>>(
            (acc, key) => assoc(keysMap[key] || key, obj[key], acc),
            {},
            keys(obj)
        )
)
export const randomNumString = (length: number) => {
    if (length <= 0) throw new Error('Number length must be more than 0.')
    let result = ''
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10)
    }
    return result
}

export const isEmpty = (x: any) => {
    return x === undefined || x === null
}
