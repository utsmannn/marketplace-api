import axios from 'axios';
require('dotenv').config()

function baseUrl(route: string, query?: string): string {
    var url = ''
    if (query === undefined) {
        url = 'https://' + process.env.FIREBASE_ID + '.firebaseio.com/' + route + '.json?print=pretty'
    } else {
        url = 'https://' + process.env.FIREBASE_ID + '.firebaseio.com/' + route + '.json' + query ?? '' + '?print=pretty'
    }
    console.log(url)
    return url
}


export class FirebaseRepository {
    async push<T>(route: string, param: any | null, query?: string): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const data = await axios.post<T>(baseUrl(route, query), param)
                resolve(data.data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async update<T>(route: string, param: any | null, query?: string): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const data = await axios.patch<T>(baseUrl(route, query), param)
                resolve(data.data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async getItem<T>(route: string, query?: string): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const raw = await axios.get<any>(baseUrl(route, query))
                const data = await raw.data
                const isEmpty = Object.entries(data).length === 0

                if (isEmpty) {
                    reject(new Error('items is empty'))
                } else {
                    resolve(data)
                }
                
            } catch (error) {
                reject(error)
            }
        })
    }

    async getItems<T>(route: string, query?: string): Promise<T[]> {
        return new Promise<T[]>(async (resolve, reject) => {
            try {
                const raw = await (await axios.get<any>(baseUrl(route, query))).data
                const data = Object.keys(raw).map(key => {
                    return raw[key]
                })
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
}