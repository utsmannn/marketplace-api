import { CartRoutes } from './cart';
import { Role } from '../../model';
import { App } from "../../impl/app";
import express, { Router } from "express"
import { UserRoutes } from './user';
import { ProductRoutes } from './product';

export class CustomerV1 implements App {
    role: Role
    router = express.Router()
    userRoute = new UserRoutes()
    
    constructor(role: Role) {
        this.role = role;
    }

    routing(path: string): Router {
        this.router.use('/' + path, this.user())
        this.router.use('/' + path, this.product())
        this.router.use('/' + path, this.cart())
        return this.router
    }

    user(): Router {
        return this.router.use('/user', this.userRoute.init(this.role))
    }

    product(): Router {
        const product = new ProductRoutes()
        return this.router.use('/product', product.init(this.role))
    }

    cart(): Router {
        const cart = new CartRoutes()
        return this.router.use('/cart', cart.init())
    }
}