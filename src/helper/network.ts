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