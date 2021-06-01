import { User, Role } from './../model';
import { FirebaseRepository } from './firebase-repository';
import { generateToken, hash, validateHash } from "../helper/jwt"
require('dotenv').config()

const firebase = new FirebaseRepository()

export class UserRepository {
    role: Role

    constructor(role: Role) {
        this.role = role
    }

    async ping(): Promise<User[]> {
        return new Promise<User[]>(async (resolve, reject) => {
            try {
                const data = await firebase.getItems<User>(this.role)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async users(): Promise<User[]> {
        return new Promise<User[]>(async (resolve, reject) => {
            try {
                const data = await firebase.getItems<User>(this.role)
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

    async findUser(id: string | undefined): Promise<User | null> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const user = await firebase.getItem<User>(this.role + '/' + id)
                resolve(user)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    reject(new Error('user not found'))
                } else {
                    reject(error)
                }
            }
        })
    }

    async findSeller(id: string | undefined): Promise<User | null> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const user = await firebase.getItem<User>(Role.SELLER + '/' + id)
                resolve(user)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    reject(new Error('user not found'))
                } else {
                    reject(error)
                }
            }
        })
    }

    async findCustomer(id: string | undefined): Promise<User | null> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const user = await firebase.getItem<User>(Role.CUSTOMER + '/' + id)
                resolve(user)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    reject(new Error('user not found'))
                } else {
                    reject(error)
                }
            }
        })
    }

    async login(username: string, password: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const users = await firebase.getItems<User>(this.role)
                var user = users.find(item => {
                    return item.username === username
                })

                if (user?.username != username) {
                    reject(Error('user invalid!'))
                } else {
                    const userUpdate = await this.updateExpired(user)
                    const hashPassword = userUpdate?.password ?? ''
                    const isValid = validateHash(password, hashPassword)
                    if (isValid) {
                        const token = generateToken(userUpdate)
                        resolve({
                            token: token
                        })
                    } else {
                        reject(Error('password invalid!'))
                    }
                }

            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    reject(new Error('user not found'))
                } else {
                    reject(error)
                }
            }
        })
    }

    async updateExpired(user: User): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const path = user.role + '/' + user.id
                await firebase.update(path, {
                    expiredAt: new Date().getTime()
                })
                const data = await firebase.getItem<User>(path)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }

    async newUser(username: string, password: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                if (username === undefined) {
                    reject(Error('username must not be null'))
                } else if (password === undefined) {
                    reject(Error('password must not be null'))
                } else {
                    var user = new User(username, this.role)
                    user.expiredAt = new Date().getTime() + 20000
                    user.password = hash(password)

                    const pushData = await firebase.push<any>(this.role + '', user)
                    const key = pushData.name
                    user.id = key
                    await firebase.update(this.role + '/' + key, user)
                    const data = await firebase.getItem<User>(this.role + '/' + key)
                    resolve(data)
                }
            } catch (error) {
                reject(error)
            }
        })
    }

}