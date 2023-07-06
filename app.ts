import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import './config/db.js';

import { checkUser, requireAuthentication } from './middleware/auth.middleware.js';

import usersRoutes from './routes/users.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import productsRoutes from './routes/products.routes.js';
import mediasRoutes from './routes/medias.routes.js';
import navigationRoutes from './routes/navigation.routes.js';
import pagesRoutes from './routes/pages.routes.js';
import customersRoutes from './routes/customers.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import carriersRoutes from './routes/carriers.routes.js';
import promotionsRoutes from './routes/promotions.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './controllers/stripe.test.controller.js';
import checkoutRoutes from './routes/checkout.routes.js';
import siteRoutes from './routes/site.routes.js';
import statisticsRoutes from './routes/statistics.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createRandomCustomers } from './__tests__/customers/customer.fake.js';
import { createRandomUsers } from './__tests__/users/user.fake.js';
import { createRandomProducts } from './__tests__/products/product.fake.js';
import { createRandomOrders } from './__tests__/orders/order.fake.js';
import { createRandomPromotions } from './__tests__/promotions/promotion.fake.js';
import { createRandomPages } from './__tests__/pages/page.fake.js';
import { createRandomCarriers } from './__tests__/carriers/carrier.fake.js';
import { createRandomCategories } from './__tests__/categories/category.fake.js';
import { createRandomCarts } from './__tests__/carts/cart.fake.js';

import { productErrors } from './errors/products.errors.js';
import { userErrors } from './errors/users.errors.js';
import { customerErrors } from './errors/customers.errors.js';
import { promotionsErrors } from './errors/promotion.errors.js';
import { categoryErrors } from './errors/categories.errors.js';
import { pageErrors } from './errors/pages.errors.js';
import { carrierErrors } from './errors/carrier.errors.js';

//Express.js initialization
const app: Express = express();

const { NODE_ENV, DEV_SERVER_URL, SERVER_URL, DEV_DASHBOARD_URL, DASHBOARD_URL, DEV_SITE_URL, SITE_URL } = process.env;
//Backend URL
const SERVER = NODE_ENV !== 'production' ? DEV_SERVER_URL : SERVER_URL;
//Dashboard URL
const DASHBOARD = NODE_ENV !== 'production' ? DEV_DASHBOARD_URL : DASHBOARD_URL;
//Site URL
const SITE = NODE_ENV !== 'production' ? DEV_SITE_URL : SITE_URL;

//CORS whitelist
const whitelist = [SERVER, DASHBOARD, SITE, 'https://checkout.stripe.com/'];

app
    .use(cors({
        //Give access to request cookies and authorization headers
        'credentials': true,
        //'Access-Control-Allow-Origin'
        //Limit server access to the whitelisted URLs
        'origin': (origin: string, callback: (err: Error | null, origin?: boolean) => void) => {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        //Authorized headers
        'allowedHeaders': ['Content-Length', 'Content-Type', 'application', 'Authorization', 'AuthType'],
        //Authorized methods
        'methods': ['GET', 'PUT', 'POST', 'DELETE']
    }))
    .all('*', (req, res, next) => {
        let origin = req.headers.origin;
        if (whitelist.indexOf(origin) >= 0) {
            res.header("Access-Control-Allow-Origin", origin);
        }
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
    .use(helmet({
        //Content-Security-Policy
        //Attenue les possibilité de d'attaque Cross-Site Scripting
        contentSecurityPolicy: true,
        //Cross-Origin-Embedder-Policy: require-corp
        //Un document ne peut charger que des ressources de la même origine ou des ressources explicitement marquées comme chargeables d'une autre origine
        crossOriginEmbedderPolicy: true,
        //Cross-Origin-Opener-Policy: same-origin
        //Permet d'assurer qu'un document de niveau supérieur ne partage pas un groupe de contexte de navigation avec des documents d'origine croisée
        //Empêche ainsi un ensemble d'attaques d'origine croisée appelées XS-Leaks
        crossOriginOpenerPolicy: true,
        //Cross-Origin-Resource-Policy: same-origin
        //Le navigateur bloque les requêtes inter-origines/intersites no-cors vers la ressource donnée
        crossOriginResourcePolicy: false,
        //Indique si un navigateur doit être autorisé ou non à afficher une page dans un fichier, <frame>, <iframe>, <embed> ou <object>.
        //Les sites peuvent l'utiliser pour éviter les attaques par détournement de clic, en s'assurant que leur contenu n'est pas intégré à d'autres sites
        frameguard: true,
        //Strict-Transport-Security
        //Informe les navigateurs que le site ne doit être accessible qu'en utilisant HTTPS et que toute tentative future d'y accéder en utilisant
        //HTTP doit être automatiquement convertie en HTTPS
        hsts: true,
        //X-Content-Type-Options
        //Empêche les utilisateurs d'Internet Explorer d'exécuter des téléchargements dans le contexte du site.
        //Certaines applications Web serviront du code HTML non approuvé pour le téléchargement. Par défaut,
        //certaines versions d'IE vous permettront d'ouvrir ces fichiers HTML dans le contexte de votre site,
        //ce qui signifie qu'une page HTML non fiable pourrait commencer à faire de mauvaises choses dans le contexte de vos pages.
        ieNoOpen: true,
        //X-Content-Type-Options
        //Marqueur utilisé par le serveur pour indiquer que les types MIME annoncés dans les Content-Type en-têtes doivent être suivis et non modifiés.
        //L'en-tête vous permet d'éviter le reniflage de type MIME en indiquant que les types MIME sont délibérément configurés.
        noSniff: true,
        //'Referer' en-tête de requête HTTP contient l'adresse absolue ou partielle à partir de laquelle une ressource a été demandée.
        //'Referer' en-tête permet au serveur d'identifier les pages de référence à partir desquelles les personnes visitent ou où
        //les ressources demandées sont utilisées. Ces données peuvent être utilisées pour l'analyse, la journalisation, la mise en cache optimisée, etc.
        referrerPolicy: true
    }))
    .use(bodyParser.json({
        //Limit le poid de la requête
        limit: '500kb',
        verify: (req: any, res, buf) => {
            //Retourne un 'buffer' du 'body' de la requête
            //Nécessaire pour stripe qui n'accepte pas le 'body' classique
            req.rawBody = buf;
        }
    }))
    //Encode les données de la requête
    .use(bodyParser.urlencoded({
        //Analyse les données de la requête avec la librairie 'querystring'
        extended: false,
        //Limit le poid de la requête
        limit: '500kb'
    }))
    //Parse le JSON du body de la requête - converti JSON en JS
    .use(express.json({
        //Limit le poid de la requête
        limit: '500kb'
    }))
    //Librairy that allow the reading of the cookies object in the request (parse them)
    .use(cookieParser());

//Middleware allowing to limit the number of requests per IP for a given time
//Prevent DOS, DDOS and brute-force type attacks
const limiter = rateLimit({
    //Time in milliseconds to receive max requests
    windowMs: 60 * 1000,
    //The maximum number of requests
    max: 300,
    //Return rate limit info in the `RateLimit-*` headers
    standardHeaders: true,
    //Disable the `X-RateLimit-*` headers
    legacyHeaders: false,
    //Message to be shown to the user on rate-limit
    message: `Too Many Request from this IP, your IP has been blocked.
    Please try again later.`
});

//Function to protect the server against HTTP Parameter Pollution attacks
//Repeated query params (?a=1&a=1) are converted by NodeJS to an array ([1, 1])
//Allows to keep only the last value (1)
const hppProtector = (req: Request, res: Response, next: NextFunction) => {
    //If the request contains query params
    if (req.query) {
        //Read each params
        for (const [key, value] of Object.entries(req.query)) {
            //If the param isn’t a string nor a number
            if (typeof value !== 'string' && typeof value !== 'number') {
                //If it’s an array
                if (Array.isArray(value)) {
                    //Assign the first value of the array to the parameter
                    req.query[key] = value[0];
                } else {
                    //If it’s not a string, a number nor an array, return an error
                    return res.status(400).json({
                        error: `Le paramètre '${key}' n\'est pas valide.`
                    });
                };
            };
        };
    };
    next();
};

app
    .use(compression())
    .use(limiter)
    .use(hppProtector)
    //Middlemare that sanitizes user-supplied data to prevent MongoDB Operator Injection.
    //Remove MongoDB operators from req.body, req.params, req.headers and req.query
    .use(mongoSanitize({ allowDots: true }));

//Middleware verifiant pour chacune des requête que l'utilisateur est authentifié et a un token JWT valide
app
    .get('/*', checkUser)
    .get('*', (req: Request, res: Response, next: NextFunction) => {
        console.log(req.originalUrl);
        next();
    });

//Middlecare permettant de verifier que l'utilisateur est authentifié et récupérer l'ID the l'utilisateur
app.get('/jwtid', requireAuthentication, (req: Request, res: Response) => {
    //Renvoie l'ID de l'utilisateur au client
    return res.status(200).send(res.locals.user._id);
});

//Router permettant au serveur de servir le frontend du Dashboard
// const router = express.Router();

// if (NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, `./build/`)));

//     router.get('/', (_, res) => {
//         res.sendFile(path.join(__dirname, './build/index.html'));
//     });
// };

//Route servant les fichiers statics du dossier 'uploads'
app.use('/uploads', express.static(path.resolve(__dirname, `./uploads/`)));

const useApiKey = (req: Request, res: Response, next: NextFunction) => {
    //Checks that the request isn't a file as API key not required
    if (req.originalUrl.includes('/uploads')) {
        next();
    } else {
        //If the 'Authorization' header is as valid key
        if (req.get('Authorization') === process.env.API_KEY) {
            //Return the response to client
            res.flush();
            next();
        } else {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials."
            });
        };
    };
};

//Create a cache instance
export const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

//Middleware that return the cached datas if the requested URL response has already been cached
const useCaches = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && req.originalUrl !== '/jwtid') {
        //Get the requested URL
        const requestedUrl = req.originalUrl;
        //If the URL is in caches
        if (cache.has(requestedUrl)) {
            //Return the cached datas
            res.send(cache.get(requestedUrl));
            res.end()
        } else {
            next();
        }
    } else {
        next();
    };
};

app
    //users url root
    .use('/api/users', useApiKey, usersRoutes)
    //categories url root
    .use('/api/categories', useApiKey, categoriesRoutes)
    //products url root
    .use('/api/products', useApiKey, productsRoutes)
    //images url root
    .use('/api/medias', useApiKey, mediasRoutes)
    //navbar url root
    .use('/api/navigation', useApiKey, useCaches, navigationRoutes)
    //pages url root
    .use('/api/pages', useApiKey, useCaches, pagesRoutes)
    //customers url root
    .use('/api/customers', useApiKey, customersRoutes)
    //orders url root
    .use('/api/orders', useApiKey, ordersRoutes)
    //carriers url root
    .use('/api/carriers', useApiKey, useCaches, carriersRoutes)
    //promotions url root
    .use('/api/promotions', useApiKey, useCaches, promotionsRoutes)
    //orders, products, customers statics url root
    .use('/api/statistics', useApiKey, useCaches, statisticsRoutes)
    //carts url root
    .use('/api/carts', useApiKey, useCaches, cartRoutes)
    //payment url root
    .use('/api/payment', paymentRoutes)
    //checkouts url root
    .use('/api/checkouts', useApiKey, checkoutRoutes)
    //site infos url root
    .use('/api/site', siteRoutes)
// .use('/', router);

/********************************************/
/****************** TESTS *******************/
/********************************************/

if (NODE_ENV !== 'production') {
    app.get('/create/fake/:id', async (req, res) => {

        if (req.params.id === 'users')
            await createRandomUsers(2)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = userErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'customers')
            await createRandomCustomers(100)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = customerErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'products')
            await createRandomProducts(1)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = productErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'orders')
            await createRandomOrders(500)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'promotions')
            await createRandomPromotions(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = promotionsErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'categories')
            await createRandomCategories(10)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = categoryErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'pages')
            await createRandomPages(30)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = pageErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'carriers')
            await createRandomCarriers(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => {
                    const errors = carrierErrors(err);
                    return res.status(400).send({ errors });
                })

        else if (req.params.id === 'carts')
            await createRandomCarts(1)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        res.end();
    });
};

/**
 * 
 */

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`);
});