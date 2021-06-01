import { Router } from 'express'
import { verifyToken } from '../../helper/jwt';
import { auth, fetch } from '../../helper/network';
import { Role, User } from '../../model';
import { UserRepository } from '../../repository/user-repository';

export class UserRoutes {
    init(role: Role): Router {
        const router = Router()
        const repository = new UserRepository(role)

        router.get('/', async (req, res) => {
            const authenticated = await verifyToken(req.headers, repository)
            const userId = (authenticated.data as User | undefined)?.id
            const sellerId = req.query.sellerId as string | undefined
            const customerId = req.query.customerId as string | undefined

            var role: Role | undefined
            if (sellerId != undefined) {
                role = Role.SELLER
            } else if (customerId != undefined) {
                role = Role.CUSTOMER
            } else {
                undefined
            }

            const findId = (req.query.sellerId as string | undefined) ?? (req.query.customerId as string | undefined) ?? userId
            switch (role) {
                case Role.SELLER:
                    const resultSeller = await auth('Get user seller', authenticated, () => {
                        return repository.findSeller(findId)
                    })
                    res.status(resultSeller.code).send(resultSeller.data)
                    break;
                case Role.CUSTOMER:
                    const resultCustomer = await auth('Get user customer', authenticated, () => {
                        return repository.findCustomer(findId)
                    })
                    res.status(resultCustomer.code).send(resultCustomer.data)
                    break;
                default:
                    const result = await auth('Get user', authenticated, () => {
                        return repository.findUser(findId)
                    })
                    res.status(result.code).send(result.data)
                    break;
            }
        })

        router.post('/register', async (req, res) => {
            const username = req.body.username
            const password = req.body.password
            const result = await fetch('Add user', repository.newUser(username, password))
            res.status(result.code).send(result.data)
        })

        router.post('/login', async (req, res) => {
            const username = req.body.username
            const password = req.body.password
            const result = await fetch('Login', repository.login(username, password))
            res.status(result.code).send(result.data)
        })

        return router
    }
}