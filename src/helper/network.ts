import { Result, User } from './../model';
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

export async function authback<T>(contextValue: string, promise: Promise<T | null | undefined>, authenticated: Result): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {

        if (authenticated.data != undefined || authenticated.data != undefined) {
            const data = await fetch(contextValue, promise)
            resolve(data)
        } else {
            const response = new Response(false, authenticated.message, null)
            const result = new Result(response).error(authenticated.message, 401)
            resolve(result)
        }
    })
}

export async function auth<T>(contextValue: string, authenticated: Result, promise: (user: User) => Promise<T | null | undefined>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {

        if (authenticated.data != undefined) {
            try {
                const user = authenticated.data as User
                const data = await fetch(contextValue, promise(user))
                resolve(data)
            } catch (error) {
                console.log('error nih...')
                reject(error)
            }
        } else {
            const response = new Response(false, authenticated.message, null)
            const result = new Result(response).error(authenticated.message, 401)
            resolve(result)
        }
    })
}