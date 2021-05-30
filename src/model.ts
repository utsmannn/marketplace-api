export class Result {
    data: any
    message: string = ''
    code: number = 200

    constructor(data: any) {
        this.data = data
    }

    error(message: string, code: number): Result {
        this.message = message
        this.code = code
        return this
    }
}

export class Response<T> {
    success = false
    message: string
    data: T
    constructor(success: boolean, message: string, data: T) {
        this.success = success
        this.message = message
        this.data = data
    }
}

export enum Role {
    CUSTOMER = "customer",
    SELLER = "seller"
}

export class User {
    id: string = ""
    username: string
    password: string = ""
    expiredAt: number = new Date().getTime()
    role: Role
    constructor(username: string, role: Role) {
        this.username = username
        this.role = role
    }
}

export class Product {
    id: string = ""
    name: string
    quantity: number
    price: number
    addedAt: number = new Date().getTime()
    sellerId: string = ''
    constructor(name: string, quantity: number, price: number) {
        this.name = name
        this.quantity = quantity
        this.price = price
    }
}