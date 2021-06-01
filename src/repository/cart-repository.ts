import { FirebaseRepository } from './firebase-repository';
import { Cart, ItemCart, ItemCartBody, Role, User } from './../model';
import { ProductRepository } from './product-repository';


const role = Role.CUSTOMER
const firebase = new FirebaseRepository()
const product = new ProductRepository()

export class CartRepository {

    // /cart/-Max9wridZc3VEkSOauo/items.json?orderBy="productId"&equalTo="-MaxHHcxa811yEbV8WG7"

    private async getItemInCart(user: User, cartId: string, productId: string): Promise<ItemCart | null> {
        return new Promise<ItemCart | null>(async (resolve, reject) => {
            try {
                if (user === undefined) {
                    resolve(null)
                } else {
                    const userId = user.id
                    const raw = await firebase.getItem<any>(`cart/${cartId}/items`, `?orderBy="productId"&equalTo="${productId}"`)
                    const keys = Object.keys(raw)[0]
                    const data = raw[keys]
                    resolve(data)
                }

            } catch (error) {
                resolve(null)
            }
        })
    }

    private async getCart(user: User): Promise<Cart | null> {
        return new Promise<Cart | null>(async (resolve, reject) => {
            try {
                if (user === undefined) {
                    resolve(null)
                } else {
                    const userId = user.id
                    const raw = await firebase.getItem<any>('cart', `?orderBy="customerId"&equalTo="${userId}"`)
                    const keys = Object.keys(raw)[0]
                    const data = raw[keys]
                    resolve(data)
                }

            } catch (error) {
                resolve(null)
            }
        })
    }

    async cart(user: User): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                const cart = await this.getCart(user)
                if (cart === null) {
                    reject(new Error('cart not found'))
                } else {
                    resolve(cart)
                }

            } catch (error) {
                reject(error)
            }
        })
    }

    async addNewCart(user: User, itemCartBody: ItemCartBody | undefined): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            console.log('new cart....')
            try {
                if (itemCartBody === undefined) {
                    reject(new Error('cart invalid!'))
                } else if (user === undefined) {
                    reject(new Error('user invalid!'))
                } else {
                    const userId = user.id
                    const items = itemCartBody.added
                    const cart = new Cart(userId, items)
                    const pushData = await firebase.push<any>('cart', cart)
                    const key = pushData.name
                    cart.id = key
                    await firebase.update('cart/' + key, cart)
                    const data = await this.cart(user)
                    resolve(data)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async pushCart(user: User, cart: Cart, key?: string): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                if (key === undefined) {
                    const pushData = await firebase.push<any>('cart', cart)
                    const key = pushData.name
                    cart.id = key
                    await firebase.update('cart/' + key, cart)
                    const data = await this.cart(user)
                    resolve(data)
                } else {
                    const updateData = await firebase.update<Cart>('cart/' + key, cart)
                    console.log('updateData.....')
                    console.log(updateData)
                    resolve(updateData)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async editCart(user: User, exisitingCart: Cart, itemCartBody: ItemCartBody): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                const key = exisitingCart.id
                const addedProducts = itemCartBody.added
                //addedProducts

                const added = await this.editing(addedProducts, user, exisitingCart, (o, n) => {
                    return o + n
                })

                console.log('added......')
                //reject(new Error('test aja'))

                const newItems = added
                exisitingCart.items = newItems
                const newCart = await this.pushCart(user, exisitingCart, key)
                resolve(newCart)

            } catch (error) {
                reject(error)
            }
        })
    }

    private async editing(items: ItemCart[], user: User, exisitingCart: Cart, operation: (o: number, n: number) => number): Promise<ItemCart[]> {
        return new Promise<ItemCart[]>(async (resolve, reject) => {
            try {
                const dataAsync = items.map(async (item) => {
                    const productId = item.productId;
                    const itemDb = await this.getItemInCart(user, exisitingCart.id, productId);
                    if (itemDb !== null) {
                        //itemDb.quantity = quantity;
                        const quantity = operation(itemDb.quantity, item.quantity)
                        itemDb.quantity = quantity
                        return itemDb;
                    } else {
                        return item;
                    }
                })

                const data = await Promise.all(dataAsync)
                resolve(data)
            } catch (error) {
                reject(error)
            }

        })
    }

    async addCart(user: User, itemCartBody: ItemCartBody | undefined): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                const exisitingCart = await this.getCart(user)
                console.log(exisitingCart)

                // if (itemCartBody === undefined) {
                //     reject(new Error('body invalid!'))
                // } else if (exisitingCart === null) {
                //     const newCart = await this.addNewCart(user, itemCartBody)
                //     resolve(newCart)
                // } else {
                //     const updatedCart = await this.editCart(user, exisitingCart, itemCartBody)
                //     resolve(updatedCart)
                // }

                if (itemCartBody === undefined) {
                    throw new Error('Body invalid!')
                } else if (exisitingCart === null) {
                    const cart = new Cart(user.id, itemCartBody.added)
                    const newCart = await this.pushCart(user, cart)
                    resolve(newCart)
                } else {
                    const updatedCart = await this.editCart(user, exisitingCart, itemCartBody)
                    console.log('updatedCart....')
                    console.log(updatedCart)
                    resolve(updatedCart)

                }


            } catch (error) {
                reject(error)
            }
        })
    }
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}
