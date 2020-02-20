export class HttpError extends Error {
    constructor(public readonly code: number, message?: string) {
        super(message)
        Object.setPrototypeOf(this, HttpError.prototype)
        Error.captureStackTrace(this, this.constructor)
    }
}

export class UnauthorizedError extends HttpError {
    constructor(message?: string) {
        super(401, message)
    }
}

export class BadRequestError extends HttpError {
    constructor(message?: string) {
        super(400, message)
    }
}
