import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit'
import compression from 'compression'
import mongoSanitize from 'express-mongo-sanitize';

import dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import './config/db.ts';
import { checkUser, requireAuth } from './middleware/auth.middleware.js';

import usersRoutes from './routes/users.routes.ts';
import categoriesRoutes from './routes/categories.routes.ts';
import productsRoutes from './routes/products.routes.ts';
import mediasRoutes from './routes/medias.routes.ts';
import navigationRoutes from './routes/navigation.routes.ts';
import pagesRoutes from './routes/pages.routes.ts';
import customersRoutes from './routes/customers.routes.ts';
import ordersRoutes from './routes/orders.routes.ts';
import carriersRoutes from './routes/carriers.routes.ts';
import promotionsRoutes from './routes/promotions.routes.ts';
import cartRoutes from './routes/cart.routes.ts';
import paymentRoutes from './controllers/stripe.controller.ts';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createRandomCustomers } from './__tests__/customers/datas.ts';
import { createRandomUsers } from './__tests__/users/datas.ts';
import { createRandomProducts } from './__tests__/products/datas.ts';
import { createRandomOrders } from './__tests__/orders/datas.ts';
import { createRandomPromotions } from './__tests__/promotions/datas.ts';

const app: Express = express();

const FRONT_URL = process.env.NODE_ENV !== 'production' ? process.env.DEV_FRONT_URL : process.env.FRONT_URL
const SERVER_URL = process.env.NODE_ENV !== 'production' ? process.env.DEV_SERVER_URL : process.env.SERVER_URL;

const whitelist = [FRONT_URL, SERVER_URL, 'https://checkout.stripe.com/']

app
    .use(cors({
        'credentials': true,
        'origin': function (origin: string, callback: (err: Error | null, origin?: boolean) => void) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(null, false);
            }
        },
        'allowedHeaders': ['Content-Length', 'Content-Type', 'application', 'sessionId', 'Authorization'],
        'methods': ['GET', 'PUT', 'POST', 'DELETE'],
        'preflightContinue': false,
    }))
    .use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: true,
        dnsPrefetchControl: true,
        frameguard: true,
        hsts: true,
        ieNoOpen: true,
        noSniff: true,
        referrerPolicy: true,
        xssFilter: true,
    }))
    .use(express.json({ limit: '50mb' }))
    .use(bodyParser.urlencoded({
        extended: false,
        limit: '150kb'
    }))
    .use(bodyParser.json({ limit: '50mb' }))
    .use(cookieParser());

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too Many Request from this IP, your IP has been blocked. Please try again later.'
})

const hppProtector = (req: Request, res: Response, next: NextFunction) => {
    if (req.query) {
        for (const [key, value] of Object.entries(req.query)) {
            if (typeof value !== 'string' && typeof value !== 'number') {
                if (Array.isArray(value)) {
                    return req.query[key] = value[0]
                } else {
                    return res.status(400).json({ error: `Le paramètre '${key}' n\'est pas valide.` })
                }
            }
        }
    }
    next()
}

app
    .use(limiter)
    .use(compression())
    .use(mongoSanitize({ allowDots: true }))
    .use(hppProtector)

app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req: Request, res: Response) => {
    return res.status(200).send(res.locals.user._id);
});

const router = express.Router()

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, `./build/`)));

    router.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, './build/index.html'));
    });
}

app.use('/uploads', express.static(path.resolve(__dirname, `./uploads/`)));

const apiKey = (req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl.includes('/uploads')) {
        next()
    } else {
        if (req.get('Authorization') === process.env.API_KEY) {
            res
            res.flush()
            next()
        } else {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials.",
            })
        }
    }
}

app
    .use('/api/users', apiKey, usersRoutes)
    .use('/api/categories', apiKey, categoriesRoutes)
    .use('/api/products', apiKey, productsRoutes)
    .use('/api/medias', apiKey, mediasRoutes)
    .use('/api/navigation', apiKey, navigationRoutes)
    .use('/api/pages', apiKey, pagesRoutes)
    .use('/api/customers', apiKey, customersRoutes)
    .use('/api/orders', apiKey, ordersRoutes)
    .use('/api/carriers', apiKey, carriersRoutes)
    .use('/api/promotions', apiKey, promotionsRoutes)
    .use('/api/carts', apiKey, cartRoutes)
    .use('/api/payment', apiKey, paymentRoutes)
    .use('/', router)

/********************************************/
/****************** TESTS *******************/
/********************************************/

if (process.env.NODE_ENV !== 'production') {
    app.get('/create/fake/:id', async (req, res) => {

        if (req.params.id === 'users')
            await createRandomUsers(2)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'customers')
            await createRandomCustomers(30)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'products')
            await createRandomProducts(100)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'orders')
            await createRandomOrders(10)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'promotions')
            await createRandomPromotions(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        res.end();
    })
}

/**
 * 
 */

const PORT = process.env.PORT || 5005

app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`)
})