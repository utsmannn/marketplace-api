import { Role } from '../../model';
import { Router } from 'express'
import { verifyAuth, verifyAuthOptional } from '../../helper/jwt';
import { Product } from '../../model';
import { ProductRepository } from '../../repository/product-repository';
import { UserRepository } from '../../repository/user-repository';


export class ProductRoutes {
    route(role: Role): Router {
        const router = Router()
        const productRepository = new ProductRepository()
        const userRepository = new UserRepository(role)

        router.get('/', async (req, res) => {
            const page = req.query.page as number | undefined
            const size = req.query.size as number | undefined

            const productId = req.query.productId as string | undefined

            const result = await verifyAuthOptional<any>('Get product', req.headers, userRepository, (user) => {
                if (user?.role === Role.SELLER) {
                    if (productId != undefined) {
                        return productRepository.product(productId, user.id)
                    } else {
                        return productRepository.productsPaging(page ?? 1, size ?? 10, user.id)
                    }
                } else {
                    const sellerId = req.query.sellerId as string | undefined
                    if (sellerId != undefined) {
                        return productRepository.productsPaging(page ?? 1, size ?? 10, sellerId)
                    } else if (productId != undefined) {
                        return productRepository.product(productId)
                    } else {
                        return productRepository.productsPaging(page ?? 1, size ?? 10)
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
                const result = await verifyAuth('Delete product', req.headers, userRepository, (user) => {
                    return productRepository.editProduct(productId, product, user)
                })
                res.status(result.code).send(result.data)
            })

            router.delete('/', async (req, res) => {
                const productId = req.query.productId as string | undefined
                const result = await verifyAuth('Edit product', req.headers, userRepository, (user) => {
                    return productRepository.delete(productId, user.id)
                })
                res.status(result.code).send(result.data)
            })
        }

        return router

    }
}
