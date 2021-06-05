import { v4 as uuid } from 'uuid';

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

export class PagingResult {
    currentPage: number
    nextPage: number | null
    maxPage: number
    totalSize: number
    pageSize: number
    products: Product[] = []
    constructor(currentPage: number, nextPage: number | null, maxPage: number, totalSize: number, pageSize: number, products: Product[]) {
        this.currentPage = currentPage
        this.nextPage = nextPage
        this.maxPage = maxPage
        this.totalSize = totalSize
        this.pageSize = pageSize
        this.products = products
    }
}

export class User {
    id: string = uuid()
    username: string
    password: string = ""
    expiredAt: number = new Date().getTime()
    role: Role
    updatedAt: number = Date.now()
    constructor(username: string, role: Role) {
        this.username = username
        this.role = role
    }
}

export class Product {
    id: string = uuid()
    name: string
    quantity: number
    price: number
    addedAt: number = Date.now()
    sellerId: string = ''
    updatedAt: number = Date.now()

    constructor(name: string, quantity: number, price: number) {
        this.name = name
        this.quantity = quantity
        this.price = price
    }
}

export class ItemCart {
    productId: string
    quantity: number
    sellerId: string
    constructor(productId: string, quantity: number, sellerId: string) {
        this.productId = productId
        this.quantity = quantity
        this.sellerId = sellerId
    }
}

export class Cart {
    id: string = uuid()
    customerId: string
    updatedAt: number  = Date.now()
    items: ItemCart[]
    
    constructor(customerId: string, items: ItemCart[]) {
        this.customerId = customerId
        this.items = items
    }
}

export enum OperationType {
    plus, minus
}