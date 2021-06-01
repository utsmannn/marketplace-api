import { UserRepository } from './../repository/user-repository';
import { Result } from './../model';
import bcrypt from "bcrypt"
import { User } from "../model"
import jwt from 'jsonwebtoken';
require('dotenv').config()

const salt = process.env.SALT || ''
const secret = process.env.SECRET || ''

export function hash(password: string): string {
    return bcrypt.hashSync(password, salt)
}

export function validateHash(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash)
}

export function generateToken(user: User): string {
    return jwt.sign(user, secret, { expiresIn: '2h' }) // 2 jam
}

export async function verifyToken(headers: NodeJS.Dict<string | string[]>, userRepo: UserRepository): Promise<Result> {
    return new Promise<Error | any>(async (resolve) => {
        const tokenBearer = headers.authorization
        if (tokenBearer === undefined) {
            const result = new Result(undefined)
            result.error('token required!', 401)
            resolve(result)
        } else {
            try {
                const token = (tokenBearer as string).split(' ')[1]
                const user = jwt.verify(token, secret) as User
                const userDb = await userRepo.findUser(user.id)

                if (userDb === null) {
                    const result = new Result(undefined)
                    const message = 'user not found!'
                    result.error(message, 401)
                    resolve(result)
                } else {
                    const updateUser = await userRepo.updateExpired(user)
                    const result = new Result(updateUser)
                    resolve(result)
                }
            } catch (error) {
                const result = new Result(undefined)
                const message = (error.message as string).replace('jwt expired', 'token expired!')
                result.error(message, 401)
                resolve(result)
            }
        }
    })
}