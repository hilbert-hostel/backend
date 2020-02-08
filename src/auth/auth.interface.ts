export interface Token {
    userID: string
}

export interface RegisterInput {
    email: string
    password: string
    firstname: string
    lastname: string
}

export interface LoginInput {
    email: string
    password: string
}
