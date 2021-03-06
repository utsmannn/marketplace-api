import { definable, removeDuplicate, requiredArrays } from './../helper/validator';
import { Path } from '../helper/constans-path';
import { Cart, ItemCart, User, Product, OperationType } from './../model';
import { FirebaseRepository } from './firebase-repository';

const firebase = new FirebaseRepository()
export class CartRepository {
    async cart(user: User): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                const p = new Path('carts').orderBy('customerId', user.id)
                const cart = await firebase.getItem<Cart>(p.url())
                definable.onDefined(cart, cart => {
                    resolve(cart)
                })

                definable.onUndefined(cart, () => {
                    reject(new Error('cart not found'))
                })
            } catch (error) {
                reject(error);
            }
        })
    }

    async bulk(user: User, operationType: OperationType, bulk: ItemCart[]): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            const isBulk = requiredArrays(bulk, 'productId', 'quantity')
            if (isBulk) {
                try {
                    const currentCart = await this.cart(user)
                    definable.onDefined(currentCart, async cart => {
                        const addedPromise = await Promise.all(
                            bulk.map(async (item) => {
                                const sameItem = cart.items.find(i => {
                                    return i.productId === item.productId
                                })

                                if (sameItem !== undefined) {
                                    const oldQuantity = sameItem.quantity
                                    const newQuantity = item.quantity

                                    if (operationType === OperationType.plus) {
                                        const nQuality: number = (oldQuantity - 0) + (newQuantity - 0)
                                        sameItem.quantity = nQuality
                                    } else {
                                        const nQuality: number = (oldQuantity - 0) - (newQuantity - 0)
                                        sameItem.quantity = nQuality
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
                        const newItem = removeDuplicate<ItemCart>(mergeItem, 'productId').filter(i => i.quantity > 0)
                        const newItemWithSellerId = await Promise.all(
                            newItem.map(async i => {
                                await this.setSellerId(i);
                                return i
                            })
                        )

                        const p = new Path('carts/' + cart.id)
                        if (newItemWithSellerId.length > 0) {
                            cart.items = newItemWithSellerId
                            try {
                                cart.updatedAt = Date.now()
                                const data = firebase.push<Cart>(p.url(), cart)
                                resolve(data)
                            } catch (error) {
                                reject(error)
                            }
                        } else {
                            try {
                                const deleteData = await firebase.delete<Cart>(p.url())
                                resolve(deleteData)
                            } catch (error) {
                                reject(error)
                            }
                        }
                    })

                    definable.onUndefined(bulk, () => {
                        reject(new Error('bulk body is invalid'))
                    })

                } catch (error) {
                    console.log('error.message...')
                    console.log(error.message)
                    if (error.message === 'cart not found') {
                        try {
                            const newCart = await this.addNewCart(bulk, user, operationType);
                            resolve(newCart)
                        } catch (error) {
                            reject(error)
                        }
                    } else if (error.message.includes('is not a function')) {
                        error.message = 'bulk body invalid'
                        reject(error)
                    } else {
                        reject(error)
                    }
                }
            } else {
                reject(new Error('bulk body is invalid'))
            }
        })
    }


    private async addNewCart(bulk: ItemCart[], user: User, operationType: OperationType): Promise<Cart> {
        return new Promise<Cart>(async (resolve, reject) => {
            try {
                if (operationType === OperationType.plus) {
                    const newItem = await Promise.all(
                        bulk.map(async (i) => {
                            await this.setSellerId(i);
                            return i;
                        })
                    );
                    const cart = new Cart(user.id, newItem);
                    cart.updatedAt = Date.now();
                    const path = new Path('carts/' + cart.id);
                    const data = await firebase.push<Cart>(path.url(), cart);
                    resolve(data);
                } else {
                    reject(new Error('forbidden, cart not found'))
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    private async setSellerId(i: ItemCart) {
        console.log('setup seller id')
        console.log('item for id for');
        console.log(i.productId);
        try {
            const p = new Path('products').orderBy('id', i.productId);
            const data = await firebase.getItem<Product>(p.url());
            i.sellerId = data?.sellerId ?? 'unknown';
        } catch (error) {
        }
    }
}