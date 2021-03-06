import { definable } from './../helper/validator';
import { User, Role } from './../model';
import { FirebaseRepository } from './firebase-repository';
import { generateToken, hash, validateHash } from "../helper/jwt"
import { Path } from '../helper/constans-path'
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
                const data = await firebase.getItems<User>(new Path('users').url())
                resolve(data)
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    error.message = 'user not found'
                }

                reject(error)
            }
        })
    }

    async findUser(id: string, roleU: Role): Promise<User | null> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const p = new Path('users/' + roleU).orderBy('id', id)
                const user = await firebase.getItem<User>(p.url())
                definable.onDefined(user, user => {
                    resolve(user)
                })

                definable.onUndefined(user, () => {
                    reject(new Error('user not found'))
                })
            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    error.message = 'user not found'
                }

                reject(error)
            }
        })
    }

    async login(username: string, password: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const p = new Path('users/' + this.role).orderBy('username', username).url()
                const user = await firebase.getItem<User>(p)
                const hashPassword = user?.password ?? ''
                const isValid = validateHash(password, hashPassword)
                if (isValid && user != undefined) {
                    const token = generateToken(user, async exp => {
                        if (exp != undefined) {
                            await this.updateExpired(user, exp)
                        }
                    })
                    resolve({
                        token: token
                    })
                } else {
                    reject(Error('password invalid!'))
                }

            } catch (error) {
                if (error.message.includes('Cannot convert undefined or null to object')) {
                    error.message = 'user not found'
                }

                reject(error)
            }
        })
    }

    async updateExpired(user: User, newExpired: number): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            try {
                user.expiredAt = newExpired
                const pNew = new Path('users/' + user.role + '/' + user.id).url()
                const data = await firebase.push<any>(pNew, user)
                resolve(data)
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

    async newUser(username: string, password: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            console.log('try register...')
            try {
                if (username === undefined) {
                    reject(Error('username must not be null'))
                } else if (password === undefined) {
                    reject(Error('password must not be null'))
                } else {
                    var user = new User(username, this.role)
                    user.expiredAt = new Date().getTime() + 20000
                    user.password = hash(password)
                    user.updatedAt = Date.now()

                    const p = new Path('users/' + user.role + '/' + user.id).url()
                    console.log('urls.......')
                    console.log(p)
                    const data = await firebase.push<User>(p, user)
                    resolve(data)
                }
            } catch (error) {
                console.log('anjiirrr')
                const salt = process.env.SALT
                console.log("salt")
                console.log(salt)
                console.log(error.message)
                reject(error)
            }
        })
    }
}