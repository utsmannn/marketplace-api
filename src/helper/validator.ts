import { Product } from '../model';

export function validatorDefineProduct(product: Product | undefined): Error | undefined {
    if (product?.name === undefined) {
        return new Error('product `name` invalid!')
    } else if (product?.price === undefined) {
        return new Error('product `price` invalid!')
    } else if (product?.quantity === undefined) {
        return new Error('product `quantity` invalid!')
    } else {
        return
    }
}

export function validatorTypeProduct(product: Product | undefined): Error | undefined {
    if (product?.name != undefined && typeof product.name != 'string') {
        return new Error('Product name must be a string')
    } else if (product?.price != undefined && typeof product.price != 'number') {
        return new Error('Product price must be a number')
    } else if (product?.quantity != undefined && typeof product.quantity != 'number') {
        return new Error('Product quantity must be a number')
    } else {
        return
    }
}