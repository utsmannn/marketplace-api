import axios from 'axios';
require('dotenv').config()

function baseUrl(route: string): string {
    return 'https://' + process.env.FIREBASE_ID + '.firebaseio.com/' + route + '.json?print=pretty'
}

export class FirebaseRepository {
    async push<T>(route: string, param: any | null): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const data = await axios.post<T>(baseUrl(route), param)
                resolve(data.data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async update<T>(route: string, param: any | null): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const data = await axios.patch<T>(baseUrl(route), param)
                resolve(data.data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async getItem<T>(route: string): Promise<T> {
        return new Promise<T>(async (resolve, reject) => {
            try {
                const raw = await (await axios.get<any>(baseUrl(route))).data
                resolve(raw)
            } catch (error) {
                reject(error)
            }
        })
    }

    async getItems<T>(route: string): Promise<T[]> {
        return new Promise<T[]>(async (resolve, reject) => {
            try {
                const raw = await (await axios.get<any>(baseUrl(route))).data
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