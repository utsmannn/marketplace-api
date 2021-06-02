import { definable, removeDuplicate, requiredArrays } from './../helper/validator';
import { Path } from '../helper/constans-path';
import { Cart, ItemCart, User, Product } from './../model';
import { FirebaseRepository } from './firebase-repository';

export enum OperationType {
    plus, minus
}

const firebase = new FirebaseRepository()
export class CartRepository {
    async cart(user: User): Promise<Cart | null> {
        return new Promise<Cart | null>(async (resolve, reject) => {
            try {
                const p = new Path('carts').orderBy('customerId', user.id)
                const cart = await firebase.getItem<Cart>(p.url())
                definable.onDefined(cart, cart => {
                    resolve(cart)
                })

                definable.onUndefined(cart, () => {
                    resolve(null)
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    async bulk(user: User, operationType: OperationType, bulk?: ItemCart[]): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const isBulk = requiredArrays(bulk, 'productId', 'quantity')
            if (isBulk) {
                try {
                    const currentCart = await this.cart(user)
                    definable.onDefined(bulk, bulk => {
                        definable.onDefined(currentCart, async cart => {
                            const addedPromise = await Promise.all(
                                bulk?.map(async (item) => {
                                    const sameItem = cart.items.find(i => {
                                        return i.productId === item.productId
                                    })

                                    if (sameItem !== undefined) {
                                        const oldQuantity = sameItem.quantity
                                        const newQuantity = item.quantity

                                        if (operationType === OperationType.plus) {
                                            sameItem.quantity = oldQuantity + newQuantity
                                        } else {
                                            sameItem.quantity = oldQuantity - newQuantity
                                        }
                                        return sameItem
                                    } else {
                                        if (operationType === OperationType.plus) {
                                            return item
                                        } else {
                                            return undefined
                                        }
                                    }
                                })
                            )

                            console.log('addedPromise')
                            console.log(addedPromise)
                            const added = addedPromise.filter(item => definable.isDefine(item))
                                .filter(item => item!.quantity > 0) as ItemCart[]


                            const mergeItem = cart.items.concat(added)
                            const newItem = removeDuplicate(mergeItem, 'productId').filter(i => i.quantity > 0)
                            const newItemWithSellerId = await Promise.all(
                                newItem.map(async i => {
                                    console.log('item for id for')
                                    console.log(i.productId)
                                    try {
                                        const p = new Path('products/' + i.productId)
                                        const data = await firebase.getItem<Product>(p.url())
                                        i.sellerId = data?.sellerId ?? 'unknown'
                                    } catch (error) {
                                    }
                                    return i
                                })
                            )

                            if (newItem.length > 0) {
                                cart.items = newItemWithSellerId
                            }

                            const p = new Path('carts/' + cart.id)
                            const data = firebase.push<Cart>(p.url(), cart)
                            resolve(data)
                        })

                        definable.onUndefined(currentCart, async () => {
                            const cart = new Cart(user.id, bulk)
                            const path = new Path('carts/' + cart.id)
                            const data = await firebase.push<Cart>(path.url(), cart)
                            resolve(data)
                        })
                    })

                    definable.onUndefined(bulk, () => {
                        reject(new Error('bulk body is invalid'))
                    })

                } catch (error) {
                    if (error.message.includes('is not a function')) {
                        error.message = 'bulk body invalid'
                    }
                    reject(error)
                }
            } else {
                reject(new Error('bulk body is invalid'))
            }

        })
    }

}