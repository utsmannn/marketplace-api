import { Product } from '../model';

export function validatorDefineProduct(product: Product | undefined): Error | undefined {
    if (definable.isDefine(product?.name) === undefined) {
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

export function required(any: any, ...required: string[]): boolean {
    return required.every(r => {
        const valid = Object.keys(any).includes(r)
        return valid
    })
}

export function requiredArrays(any: any, ...requiredKey: string[]): boolean {
    const keys = Object.keys(any)
    const isArray = required(keys, '0')

    const isValid = keys.every(k => {
        const obj = any[k]
        const isOk = required(obj, ...requiredKey)
        return isOk
    })
    return isValid
}

class Definable {
    isDefine<T>(value?: T): boolean {
        return value !== undefined || value != null
    }

    onDefined<T>(value: T | undefined | null, defined: (define: T) => void) {
        if (value != undefined || value != null) {
            defined(value)
        }
    }

    onUndefined<T>(value: T | undefined | null, defined: (define: T | undefined | null) => void) {
        if (value === undefined || value === null) {
            defined(value)
        }
    }
}

export const definable = new Definable()

export function filterBy(data: any[], key: any): any[] {
    return [
        new Map(data.map(i => [key(i), i])).values()
    ]
}

export function removeDuplicate(originalArray: any[], prop: any): any[] {
    var newArray = [];
    var lookupObject: any = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}