import axios from 'axios';
import { Path } from '../helper/constans-path';
import { definable } from '../helper/validator';
require('dotenv').config()

const timeout = 15000

function baseUrl(route: string): string {
    const url = 'https://' + process.env.FIREBASE_ID + '.firebaseio.com/' + route
    console.log(url)
    return url
}

export class FirebaseRepository {
    async push<T>(route: string, param: any | null): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const data = await axios.patch<T>(baseUrl(route), param, { timeout: timeout })
                resolve(data.data)
            } catch (error) {
                console.log(error.message)
                reject(error)
            }
        })
    }

    async getItem<T>(route: string): Promise<T | undefined> {
        return new Promise<T | undefined>(async (resolve, reject) => {
            try {
                const data = await axios.get<any | undefined>(baseUrl(route), { timeout: timeout })
                const raw = await data.data
                definable.onDefined(raw, raw => {
                    const keys = Object.keys(raw)
                    if (keys.length === 1) {
                        resolve(raw[keys[0]])
                    } else if (keys.length === 0) {
                        resolve(undefined)
                    } else {
                        resolve(raw)
                    }
                })

                definable.onUndefined(raw, () => {
                    reject(new Error('not found!'))
                })
            } catch (error) {
                console.log(error.message)
                reject(error)
            }
        })
    }

    async getItems<T>(route: string): Promise<T[]> {
        return new Promise<T[]>(async (resolve, reject) => {
            try {
                const raw = await (await axios.get<any>(baseUrl(route), { timeout: timeout })).data
                const data = Object.keys(raw).map(key => {
                    return raw[key]
                })
                resolve(data)
            } catch (error) {
                console.log(error.message)
                reject(error)
            }
        })
    }

    async getShallow(route: string): Promise<string[]> {
        return new Promise<string[]>(async (resolve, reject) => {
            try {
                const raw = await (await axios.get<any>(baseUrl(route + '?shallow=true'), { timeout: timeout })).data
                const data = Object.keys(raw).sort()
                resolve(data)
            } catch (error) {
                console.log(error.message)
                reject(error)
            }
        })
    }
}