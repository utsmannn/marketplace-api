import { UserRepository } from './../repository/user-repository';
import { Result, Response } from './../model';
import bcrypt from "bcrypt"
import { User } from "../model"
import jwt from 'jsonwebtoken';
import { fetch } from './network';
import { definable } from './validator';
require('dotenv').config()

const salt = process.env.SALT || ''
const secret = process.env.SECRET || ''

export function hash(password: string): string {
    return bcrypt.hashSync(password, salt)
}

export function validateHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
}

export function generateToken(user: User, newExp: (exp?: number) => void): string {
    const token = jwt.sign(user, secret, { expiresIn: '1800s' }) // 30 minute
    try {
        const exp = extractExp(token)
        newExp(exp)
    } catch (error) {
    }

    return token
}

function extractExp(token: string): number {
    const payload = jwt.decode(token) as any
    const exp = payload.exp as number
    return exp
}

export async function verifyToken(headers: NodeJS.Dict<string | string[]>, userRepo: UserRepository): Promise<Result> {
    return new Promise<Error | any>(async (resolve) => {
        const tokenBearer = headers.authorization
        definable.onUndefined(tokenBearer, () => {
            const result = new Result(undefined)
            result.error('token required!', 401)
            resolve(result)
        })

        definable.onDefined(tokenBearer, async bearer => {
            try {
                const token = (bearer as string).split(' ')[1]
                const payload = jwt.verify(token, secret)
                const user = payload as User
                const userDb = await userRepo.findUser(user.id, user.role)
                const tokenExp = extractExp(token)

                if (userDb === null) {
                    const result = new Result(undefined)
                    const message = 'user not found!'
                    result.error(message, 401)
                    resolve(result)
                } else if (userDb.expiredAt != tokenExp) {
                    const result = new Result(undefined)
                    const message = 'session expired!'
                    result.error(message, 401)
                    resolve(result)
                } else {
                    const result = new Result(userDb)
                    resolve(result)
                }
            } catch (error) {
                const result = new Result(undefined)
                const message = (error.message as string).replace('jwt expired', 'token expired!')
                result.error(message, 401)
                resolve(result)
            }
        })
    })
}

export async function verifyAuth<T>(
    context: string,
    headers: NodeJS.Dict<string | string[]>,
    userRepo: UserRepository,
    promise: (user: User) => Promise<T | null | undefined>):
    Promise<Result> {
        const authenticated = await verifyToken(headers, userRepo)
        return new Promise<any>(async (resolve, reject) => {

            definable.onDefined(authenticated.data, async (d) => {
                try {
                    const user = d as User
                    const data = await fetch(context, promise(user))
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            })

            definable.onUndefined(authenticated.data, () => {
                const response = new Response(false, authenticated.message, null)
                const result = new Result(response).error(authenticated.message, 401)
                resolve(result)
            })
        })
}

export async function verifyAuthOptional<T>(
    context: string,
    headers: NodeJS.Dict<string | string[]>,
    userRepo: UserRepository,
    promise: (user?: User) => Promise<T | null | undefined>):
    Promise<Result> {
        const authenticated = await verifyToken(headers, userRepo)
        return new Promise<any>(async (resolve, reject) => {

            definable.onDefined(authenticated.data, async (d) => {
                try {
                    const user = d as User
                    const data = await fetch(context, promise(user))
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            })

            definable.onUndefined(authenticated.data, async () => {
                try {
                    const data = await fetch(context, promise(undefined))
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            })
        })
}