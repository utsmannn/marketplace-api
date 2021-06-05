import { Router } from 'express'
import { verifyAuth } from '../../helper/jwt';
import { fetch } from '../../helper/network';
import { Role } from '../../model';
import { UserRepository } from '../../repository/user-repository';

export class UserRoutes {
    route(role: Role): Router {
        const router = Router()
        const repository = new UserRepository(role)

        router.get('/all', async (req, res) => {
            const result = await fetch('Get users', repository.users())
            res.status(result.code).send(result.data)
        })

        router.get('/', async (req, res) => {
            const customerIdQ = req.query.customerId as string | undefined
            const sellerIdQ = req.query.sellerId as string | undefined

            var roleFind: Role | undefined
            if (sellerIdQ != undefined) {
                roleFind = Role.SELLER
            } else if (customerIdQ != undefined) {
                roleFind = Role.CUSTOMER
            } else {
                undefined
            }

            const result = await verifyAuth('Get user', req.headers, repository, (user) => {
                const role = user.role
                const userDefault = repository.findUser(user.id, role)
                switch (roleFind) {
                    case Role.SELLER:
                        if (sellerIdQ != undefined) {
                            return repository.findUser(sellerIdQ, roleFind)
                        } else {
                            return userDefault
                        }
                    case Role.CUSTOMER:
                        if (customerIdQ != undefined) {
                            return repository.findUser(customerIdQ, roleFind)
                        } else {
                            return userDefault
                        }
                    default:
                        return userDefault
                }
            })

            res.status(result.code).send(result.data)
        })

        router.post('/register', async (req, res) => {
            const username = req.body.username
            const password = req.body.password
            const result = await fetch('Add user', repository.newUser(username, password))
            res.status(result.code).send(result.data)
        })

        router.post('/login', async (req, res) => {
            console.log('login.....')
            const username = req.body.username
            const password = req.body.password
            const result = await fetch('Login', repository.login(username, password))
            res.status(result.code).send(result.data)
        })

        return router
    }
}