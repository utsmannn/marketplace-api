import { validatorDefineProduct, validatorTypeProduct } from '../helper/validator';
import { Product, Role, User } from './../model';
import { FirebaseRepository } from './firebase-repository';

const firebase = new FirebaseRepository()
export class ProductRepository {

    async push(product: Product | undefined, user: User | undefined): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                if (product != undefined) {
                    const errorDefine = validatorDefineProduct(product)
                    const errorType = validatorTypeProduct(product)

                    if (errorDefine) {
                        reject(errorDefine)
                    } else if (errorType) {
                        reject(errorType)
                    } else {
                        product.sellerId = user?.id ?? 'unknown'
                        const pushData = await firebase.push<any>('product', product)
                        const key = pushData.name
                        product.id = key
                        await firebase.update('product/' + key, product)
                        const data = await firebase.getItem<Product>('product/' + key)
                        resolve(data)
                    }
                } else if (user?.role === Role.CUSTOMER) {
                    reject(new Error('User not permission to push product'))
                } else {
                    reject(new Error('Product invalid!'))
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async products(): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                const data = await firebase.getItems<Product>('product')
                resolve(data)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    resolve([])
                } else {
                    reject(error)
                }
            }
        })
    }

    async productsSellerId(user: User | undefined): Promise<Product[]> {
        return new Promise<Product[]>(async (resolve, reject) => {
            try {
                const query = `?orderBy="sellerId"&equalTo="${user?.id}"`
                const data = await firebase.getItems<Product>('product', query)
                resolve(data)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    resolve([])
                } else {
                    reject(error)
                }
            }
        })
    }

    async productSellerId(id: string, user: User | undefined): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const query = `?orderBy="sellerId"&equalTo="${user?.id}"`
                const data = await firebase.getItems<Product>('product', query)
                const filtered = data.find(item => {
                    return item.id == id
                })

                if (filtered === undefined) {
                    reject(new Error('product not found!'))
                } else {
                    resolve(filtered)
                }
                
            } catch (error) {
                reject(error)
            }
        })
    }

    async product(id: string): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const data = await firebase.getItem<Product>('product/' + id)
                if (data != null) {
                    resolve(data)
                } else {
                    reject(new Error('product not found!'))
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    async editProduct(id: string | undefined, product: Product | undefined, user: User | undefined): Promise<Product> {
        return new Promise<Product>(async (resolve, reject) => {
            try {
                const error = validatorTypeProduct(product)
                if (error === undefined) {
                    const data = await firebase.getItem<Product>('product/' + id)
                    if (user?.role === Role.CUSTOMER || data.sellerId != user?.id) {
                        reject(new Error('User not permission to edit product'))
                    } else {
                        await firebase.update('product/' + id, product)
                        const dataUpdate = await firebase.getItem<Product>('product/' + id)
                        resolve(dataUpdate)
                    }
                } else {
                    reject(error)
                }

            } catch (error) {
                reject(error)
            }
        })
    }

}