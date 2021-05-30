import { Role } from '../../model';
import { App } from "../../impl/app";
import express, { Router } from "express"
import { UserRoutes } from './user';
import { ProductRoutes } from './product';

export class SellerV1 implements App {
    role: Role
    router = express.Router()
    
    constructor(role: Role) {
        this.role = role;
    }

    routing(path: string): Router {
        this.router.use('/' + path, this.user())
        this.router.use('/' + path, this.product())
        return this.router
    }

    user(): Router {
        const userRoute = new UserRoutes()
        return this.router.use('/user', userRoute.init(this.role))
    }

    product(): Router {
        const product = new ProductRoutes()
        return this.router.use('/product', product.init(this.role))
    }
}