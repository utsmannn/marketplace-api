import { Path } from '../helper/constans-path';
import { definable, validatorDefineProduct, validatorTypeProduct } from '../helper/validator';
import { Product, Role, User, PagingResult } from './../model';
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
                            product.updatedAt = Date.now();

                            const p = new Path('products' + '/' + product.id)
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

    async productsPaging(page: number, size: number, sellerId?: string): Promise<PagingResult | undefined> {
        console.log('paging....')
        return new Promise<PagingResult | undefined>(async (resolve, reject) => {
            definable.onDefined(sellerId, async id => {
                const p = new Path('products').orderBy('sellerId', id)
                try {
                    const data = await firebase.getItems<Product>(p.url())
                    var maxPage = Math.round(data.length / size)
                    if (data.length < size) {
                        maxPage = 1
                    }
                    
                    const offset = (page - 1) * size + 1
                    if (page <= maxPage) {
                        const dataPage = data.slice(offset-1, (offset-1) + size)
                        var nextPage: number | null = (page - 0) + 1
                        if (page == maxPage) {
                            nextPage = null
                        }

                        const result = new PagingResult((page - 0), nextPage, maxPage, dataPage)
                        resolve(result)
                    } else {
                        reject(new Error('cannot get page more than ' + maxPage))
                    }

                } catch (error) {
                    reject(error)
                }
            })

            definable.onUndefined(sellerId, async () => {
                const pPage = new Path('products')
                const p = new Path('products').orderBy('$key')

                try {
                    const shallow = await firebase.getShallow(pPage.url())
                    console.log('shallow')
                    console.log(shallow)

                    const offset = (page - 1) * size
                    var maxPage = Math.round(shallow.length / size)

                    if (shallow.length < size) {
                        maxPage = 1
                    }

                    if (page <= maxPage) {
                        const keyStart = shallow[offset]

                        const dataPage = await firebase.getItems<Product>(p.page(keyStart, size))
                        var nextPage: number | null = (page - 0) + 1
                        if (page == maxPage) {
                            nextPage = null
                        }

                        const result = new PagingResult((page - 0), nextPage, maxPage, dataPage)
                        resolve(result)
                    } else {
                        reject(new Error('cannot get page more than ' + maxPage))
                    }

                } catch (error) {
                    if (error.message.includes('undefined or null to object')) {
                        resolve(undefined)
                    } else {
                        reject(error)
                    }
                }
            })
        })
    }

    async product(id: string, sellerId?: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const p = new Path('products').orderBy('id', id)
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
                    const p = new Path('products').orderBy('id', productId)
                    const item = await firebase.getItem<Product>(p.url())
                    console.log('item')
                    console.log(item)

                    definable.onDefined(item, async item => {
                        if (item.sellerId === user.id) {
                            item.updatedAt = Date.now()
                            const newProduct = this.mergeProduct(item, product)
                            const pNew = new Path('products/' + newProduct.id)

                            const data = await firebase.push<Product>(pNew.url(), newProduct)
                            console.log('new data')
                            console.log(data)
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

    mergeProduct(oldProduct: Product, newProduct: Product | undefined): Product {
        const updatedProduct = new Product(
            newProduct?.name ?? oldProduct.name,
            newProduct?.quantity ?? oldProduct.quantity,
            newProduct?.price ?? oldProduct.price
        )
        updatedProduct.id = oldProduct.id
        updatedProduct.sellerId = oldProduct.sellerId
        updatedProduct.addedAt = oldProduct.addedAt
        updatedProduct.updatedAt = newProduct?.updatedAt ?? Date.now()
        return updatedProduct
    }

}