import { Router } from 'express';

export interface App {
    routing(path: string): Router
    user(): Router
    product(): Router
}