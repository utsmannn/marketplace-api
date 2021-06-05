import { CartRoutes } from './v1/cart';
import { Router } from 'express';
import { Role } from '../model';
import { ProductRoutes } from './v1/product';
import { UserRoutes } from './v1/user';

const userRoutes = new UserRoutes()
const productRoutes = new ProductRoutes()
const cartRoutes = new CartRoutes()

const sellerPath = '/seller'
const consumerPath = '/customer'

function sellerRoute(): Router {
    const router = Router()
    router.use(sellerPath + '/user', userRoutes.route(Role.SELLER))
    router.use(sellerPath + '/product', productRoutes.route(Role.SELLER))
    return router
}

function customerRoute(): Router {
    const router = Router()
    router.use(consumerPath + '/user', userRoutes.route(Role.CUSTOMER))
    router.use(consumerPath + '/product', productRoutes.route(Role.CUSTOMER))
    router.use(consumerPath + '/cart', cartRoutes.route())
    return router
}

export const seller = sellerRoute()
export const customer = customerRoute()