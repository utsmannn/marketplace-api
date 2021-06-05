import { ItemCart, Result, OperationType } from './../../model';
import { CartRepository } from './../../repository/cart-repository';
import { Role } from '../../model';
import { Router } from 'express'
import { verifyAuth } from '../../helper/jwt';
import { UserRepository } from '../../repository/user-repository';

const cartRepository = new CartRepository()
const userRepository = new UserRepository(Role.CUSTOMER)

export class CartRoutes {
    route(): Router {
        const router = Router()

        router.get('/', async (req, res) => {
            const result = await verifyAuth('Get cart', req.headers, userRepository, (user) => {
                return cartRepository.cart(user)
            })

            res.status(result.code).send(result.data)
        })

        router.post('/', async (req, res) => {
            const result = await this.operationSingle('Add cart', req, OperationType.plus);
            res.status(result.code).send(result.data)
        })

        router.delete('/', async (req, res) => {
            const result = await this.operationSingle('Delete cart', req, OperationType.minus);
            res.status(result.code).send(result.data)
        })

        router.post('/bulk', async (req, res) => {
            const body = req.body
            const result = await verifyAuth('Add cart', req.headers, userRepository, (user) => {
                return cartRepository.bulk(user, OperationType.plus, body)
            })
            res.status(result.code).send(result.data)
        })

        router.delete('/bulk', async (req, res) => {
            const bulk = req.body
            const result = await verifyAuth('Delete cart', req.headers, userRepository, (user) => {
                return cartRepository.bulk(user, OperationType.minus, bulk)
            })
            res.status(result.code).send(result.data)
        })

        return router

    }

    async operationSingle(context: string, req: any, operationType: OperationType): Promise<Result> {
        const productId = req.query.productId;
        const quantity = req.query.quantity;

        const result = await verifyAuth(context, req.headers, userRepository, (user) => {
            if (productId != undefined) {
                const newBody = new ItemCart(productId as string, (quantity as number | undefined) ?? 1, '');
                return cartRepository.bulk(user, operationType, [newBody]);
            } else {
                return Promise.reject(new Error('body invalid!'));
            }
        });
        return result;
    }
}