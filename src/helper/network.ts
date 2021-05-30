import { Result } from './../model';
import { Response } from '../model';
require('dotenv').config()

export async function fetch<T>(contextValue: string, promise: Promise<T>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        try {
            const data = await promise
            const message = `${contextValue} success!`
            const response = new Response(true, message, data)
            const result = new Result(response)
            resolve(result)
        } catch (error) {
            const message = `${contextValue} failure, caused ${error.message}`
            const response = new Response(false, message, null)
            const result = new Result(response).error(message, 500)
            resolve(result)
        }
    })
}

export async function auth<T>(contextValue: string, promise: Promise<T>, authenticated: Result): Promise<any> {
    return new Promise<any>(async (resolve) => {
        if (authenticated.data === undefined) {
            const response = new Response(false, authenticated.message, null)
            const result = new Result(response).error(authenticated.message, 401)
            resolve(result)
        } else {
            const data = await fetch(contextValue, promise)
            resolve(data)
        }
    })
}