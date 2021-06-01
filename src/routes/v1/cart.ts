import { CartRepository, OperationType } from './../../repository/cart-repository';
import { ItemCartBulk, Role } from '../../model';
import { Router } from 'express'
import { verifyAuth, verifyToken } from '../../helper/jwt';
import { Product, User } from '../../model';
import { ProductRepository } from '../../repository/product-repository';
import { UserRepository } from '../../repository/user-repository';

export class CartRoutes {
    route(): Router {
        const router = Router()
        const cartRepository = new CartRepository()
        const productRepository = new ProductRepository()
        const userRepository = new UserRepository(Role.CUSTOMER)
        
        router.get('/', async (req, res) => {
            const result = await verifyAuth('Get cart', req.headers, userRepository, (user) => {
                return cartRepository.cart(user)
            })

            res.status(result.code).send(result.data)
        })

        router.post('/bulk', async (req, res) => {
            const bulk = req.body
            const result = await verifyAuth('Add bulk cart', req.headers, userRepository, (user) => {
                return cartRepository.bulk(user, OperationType.plus, bulk)
            })
            res.status(result.code).send(result.data)
        })

        router.delete('/bulk', async (req, res) => {
            const bulk = req.body
            const result = await verifyAuth('Add bulk cart', req.headers, userRepository, (user) => {
                return cartRepository.bulk(user, OperationType.minus, bulk)
            })
            res.status(result.code).send(result.data)
        })

        return router

    }
}