import { Path } from '../helper/constans-path';
import { definable, validatorDefineProduct, validatorTypeProduct } from '../helper/validator';
import { Product, Role, User } from './../model';
import { FirebaseRepository } from './firebase-repository';
import { v4 as uuid } from 'uuid';

const firebase = new FirebaseRepository()
export class ProductRepository {
    async push(product: Product | undefined, user: User): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                if (user?.role === Role.CUSTOMER) {
                    reject(new Error('User not permission to push product'))
                } else {
                    definable.onDefined(product, async product => {
                        const errorDefine = validatorDefineProduct(product)
                        const errorType = validatorTypeProduct(product)
    
                        if (errorDefine) {
                            reject(errorDefine)
                        } else if (errorType) {
                            reject(errorType)
                        } else {
                            product.id = uuid()
                            const p = new Path('products/' + product.id)
                            product.sellerId = user.id
                            const data = await firebase.push<Product>(p.url(), product)
                            resolve(data)
                        }
                    })

                    definable.onUndefined(product, () => {
                        reject(new Error('Product invalid!'))
                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async products(sellerId?: string): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                definable.onDefined(sellerId, async id => {
                    const p = new Path('products').orderBy('sellerId', id)
                    const data = await firebase.getItems<Product>(p.url())
                    resolve(data)
                })

                definable.onUndefined(sellerId, async () => {
                    const p = new Path('products')
                    const data = await firebase.getItems<Product>(p.url())
                    resolve(data)
                })
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    resolve([])
                } else {
                    reject(error)
                }
            }
        })
    }

    async product(id: string, sellerId?: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const p = new Path('products/' + id)
                const data = await firebase.getItem<Product>(p.url())

                definable.onDefined(data, data => {
                    if (data.sellerId === sellerId) {
                        resolve(data)
                    } else {
                        reject(new Error('product not found!'))
                    }
                })

                definable.onUndefined(data, () => {
                    reject(new Error('product not found!'))
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    async editProduct(productId: string | undefined, product: Product | undefined, user: User): Promise<Product> {
        console.log('edited....')
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const error = validatorTypeProduct(product)
                definable.onDefined(error, error => {
                    reject(error)
                })

                definable.onUndefined(error, async () => {
                    const p = new Path('products/' + productId)
                    const item = await firebase.getItem<Product>(p.url())
                    console.log('item')
                    console.log(item)

                    definable.onDefined(item, async item => {
                        if (item.sellerId === user.id) {
                            const newData = await firebase.push<Product>(p.url(), product)
                            const data = this.mergeProduct(item, newData)
                            resolve(data)
                        } else {
                            reject(new Error('you not permission to edit this product'))
                        }
                    })

                    definable.onUndefined(item, () => {
                        reject(new Error('product not found'))
                    })
                })

            } catch (error) {
                if (error.message.includes('not found!')) {
                    error.message = 'product not found!'
                }
                reject(error)
            }
        })
    }

    mergeProduct(oldProduct: Product, newProduct: Product): Product {
        const updatedProduct = new Product(
            newProduct.name ?? oldProduct.name,
            newProduct.quantity ?? oldProduct.quantity,
            newProduct.price ?? oldProduct.price
        )
        updatedProduct.id = oldProduct.id
        updatedProduct.sellerId = oldProduct.sellerId
        updatedProduct.addedAt = oldProduct.addedAt
        return updatedProduct
    }

}