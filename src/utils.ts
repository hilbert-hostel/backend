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
