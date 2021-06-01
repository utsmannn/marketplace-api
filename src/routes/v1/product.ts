import { Role } from '../../model';
import { Router } from 'express'
import { verifyToken } from '../../helper/jwt';
import { auth } from '../../helper/network';
import { Product, User } from '../../model';
import { ProductRepository } from '../../repository/product-repository';
import { UserRepository } from '../../repository/user-repository';

export class ProductRoutes {
    init(role: Role): Router {
        const router = Router()
        const repository = new ProductRepository()
        const userRepository = new UserRepository(role)

        router.get('/', async (req, res) => {
            const authenticated = await verifyToken(req.headers, userRepository)
            const id = req.query.id as string | undefined

            if (id === undefined) {
                if (role === Role.SELLER) {
                    const result = await auth('Get product', authenticated, (user) => {
                        return repository.productsSellerId(user)
                    })
                    res.status(result.code).send(result.data)
                } else {
                    const result = await auth('Get product', authenticated, () => {
                        return repository.products()
                    })
                    res.status(result.code).send(result.data)
                }
            } else {
                if (role === Role.SELLER) {
                    const result = await auth('Get product by id', authenticated, (user) => {
                        return repository.productSellerId(id, user)
                    })
                    res.status(result.code).send(result.data)
                } else {
                    const result = await auth('Get product by id', authenticated, () => {
                        return repository.product(id)
                    })
                res.status(result.code).send(result.data)
                }
            }
        })

        if (role === Role.SELLER) {
            router.post('/', async (req, res) => {
                const product = req.body as Product | undefined
                const authenticated = await verifyToken(req.headers, userRepository)
                const result = await auth('Push product', authenticated, (user) => {
                    return repository.push(product, user)
                })
                res.status(result.code).send(result.data)
            })

            router.patch('/', async (req, res) => {
                const product = req.body as Product | undefined
                const id = req.query.id as string | undefined
                const authenticated = await verifyToken(req.headers, userRepository)
                const result = await auth('Patch product', authenticated, (user) => {
                    return repository.editProduct(id, product, user)
                })
                res.status(result.code).send(result.data)
            })
        }

        return router

    }
}
