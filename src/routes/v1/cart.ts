import { UserRepository } from './../../repository/user-repository';
import { ItemCartBody, Role, User } from './../../model';
import { CartRepository } from './../../repository/cart-repository';
import { Router } from "express";
import { verifyToken } from '../../helper/jwt';
import { auth } from '../../helper/network';


export class CartRoutes {
    init(): Router {
        const router = Router()
        const cartRepository = new CartRepository()
        const userRepository = new UserRepository(Role.CUSTOMER)

        router.post('/', async (req, res) => {
            const authenticated = await verifyToken(req.headers, userRepository)
            const itemCart = req.body as ItemCartBody | undefined
            const result = await auth('Cart', authenticated, (user) => {
                console.log('add cart.....')
                return cartRepository.addCart(user, itemCart)
            })
            res.status(result.code).send(result.data)
        })

        router.get('/', async (req, res) => {
            console.log('get cart')
            const authenticated = await verifyToken(req.headers, userRepository)
            const result = await auth('Get cart', authenticated, (user) => {
                return cartRepository.cart(user)
            })
            res.status(result.code).send(result.data)
        })

        return router
    }
}