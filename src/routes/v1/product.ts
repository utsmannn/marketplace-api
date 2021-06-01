import { Role } from '../../model';
import { Router } from 'express'
import { verifyAuth } from '../../helper/jwt';
import { Product } from '../../model';
import { ProductRepository } from '../../repository/product-repository';
import { UserRepository } from '../../repository/user-repository';

export class ProductRoutes {
    route(role: Role): Router {
        const router = Router()
        const productRepository = new ProductRepository()
        const userRepository = new UserRepository(role)

        router.get('/', async (req, res) => {
            const productId = req.query.productId as string | undefined
            const result = await verifyAuth<any>('Get product', req.headers, userRepository, (user) => {
                if (user.role === Role.SELLER) {
                    if (productId != undefined) {
                        return productRepository.product(productId, user.id)
                    } else {
                        return productRepository.products(user.id)
                    }
                } else {
                    const sellerId = req.query.sellerId as string | undefined
                    if (sellerId != undefined) {
                        return productRepository.products(sellerId)
                    } else if (productId != undefined) {
                        return productRepository.product(productId)
                    } else {
                        return productRepository.products()
                    }
                }
            })
            res.status(result.code).send(result.data)
        })

        if (role === Role.SELLER) {
            router.post('/', async (req, res) => {
                const product = req.body as Product | undefined
                const result = await verifyAuth('Add product', req.headers, userRepository, (user) => {
                    return productRepository.push(product, user)
                })
                res.status(result.code).send(result.data)
            })

            router.patch('/', async (req, res) => {
                const productId = req.query.productId as string | undefined
                const product = req.body as Product | undefined
                const result = await verifyAuth('Edit product', req.headers, userRepository, (user) => {
                    return productRepository.editProduct(productId, product, user)
                })
                res.status(result.code).send(result.data)
            })
        }

        return router

    }
}
