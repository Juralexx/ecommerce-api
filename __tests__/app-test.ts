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
import './db-test.js';
import { checkUser, requireAuthentication } from '../middleware/auth.middleware.js';

import usersRoutes from '../routes/users.routes.js';
import categoriesRoutes from '../routes/categories.routes.js';
import productsRoutes from '../routes/products.routes.js';
import mediasRoutes from '../routes/medias.routes.js';
import navigationRoutes from '../routes/navigation.routes.js';
import pagesRoutes from '../routes/pages.routes.js';
import customersRoutes from '../routes/customers.routes.js';
import ordersRoutes from '../routes/orders.routes.js';
import carriersRoutes from '../routes/carriers.routes.js';
import promotionsRoutes from '../routes/promotions.routes.js';
import cartRoutes from '../routes/cart.routes.js';
import paymentRoutes from '../controllers/stripe.test.controller.js';
import siteRoutes from '../routes/site.routes.js';
import statisticsRoutes from '../routes/statistics.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createRandomCustomers } from './customers/customer.fake.js';
import { createRandomUsers } from './users/user.fake.js';
import { createRandomProducts } from './products/product.fake.js';
import { createRandomOrders } from './orders/order.fake.js';
import { createRandomPromotions } from './promotions/promotion.fake.js';
import { createRandomPages } from './pages/page.fake.js';
import { createRandomCarriers } from './carriers/carrier.fake.js';
import { createRandomCategories } from './categories/category.fake.js';
import { createRandomCarts } from './carts/cart.fake.js';

//Initialisation de express.js
export const app: Express = express();

//Assignation de l'adresse du frontend en fonction de la variable NODE_ENV
const DASHBOARD_URL = process.env.NODE_ENV !== 'production' ? process.env.DEV_DASHBOARD_URL : process.env.DASHBOARD_URL
//Assignation de l'adresse du backend
const SERVER_URL = process.env.SERVER_URL_TEST;

//Les adresses suivantes seront les seules à pouvoir accèder aux APIs
const whitelist = [DASHBOARD_URL, SERVER_URL, 'https://checkout.stripe.com/', 'https://stripe.com']

app
    .use(cors({
        //Permet d'accèder aux cookies et authorization headers dans les requêtes
        'credentials': true,
        //Limitation d'accès au urls présents dans la whitelist
        'origin': function (origin: string, callback: (err: Error | null, origin?: boolean) => void) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(null, false);
            }
        },
        //Headers authorisés
        'allowedHeaders': ['Content-Length', 'Content-Type', 'application', 'sessionId', 'Authorization'],
        //Méthodes autorisées
        'methods': ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
    }))
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
        crossOriginResourcePolicy: true,
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
        //Marqueur utilisé par le serveur pour indiquer que les types MIME annoncés dans les Content-Typeen-têtes doivent être suivis et non modifiés.
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
            req.rawBody = buf
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
    .use(cookieParser());

//Middleware permettant de limiter le nombre de requête par IP pour un temps donné
//Prévient les attaques DOS, DDOS et attaques de type brute-force
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
    message: 'Too Many Request from this IP, your IP has been blocked. Please try again later.'
});

//Fonction permettant de protéger le serveur contre les attaques HTTP Parameter Pollution attacks
//Les query params répétés (?number=1&number=1) sont converti pas NodeJS en tableau ([1, 1])
//Permet de ne garder que la dernière valeur (1)
const hppProtector = (req: Request, res: Response, next: NextFunction) => {
    //Si la requête contiens des query params
    if (req.query) {
        //Nous les lisons un par un
        for (const [key, value] of Object.entries(req.query)) {
            //Si le paramêtre n'est ni une chaine de charactère ni un nombre
            if (typeof value !== 'string' && typeof value !== 'number') {
                //Si il s'agit d'un tableau
                if (Array.isArray(value)) {
                    //Si assignons la première valeur du tableau au paramêtre
                    req.query[key] = value[0];
                } else {
                    //Si il s'agit d'un autre type de valeur, nous renvoyons un message d'erreur
                    return res.status(400).json({ error: `Le paramètre '${key}' n\'est pas valide.` });
                };
            };
        };
    };
    next();
};

app
    //Le middleware tentera de compresser les corps de réponse pour toutes les requêtes qui traversent le middleware, en fonction du fichier options.
    .use(compression())
    .use(limiter)
    //Middlemare qui nettoie les données fournies par l'utilisateur pour empêcher MongoDB Operator Injection.
    //Supprimer les opérateurs MongoDB de req.body, req.params, req.headers et req.query
    .use(mongoSanitize({ allowDots: true }))
    .use(hppProtector);

//Middleware verifiant pour chacune des requête que l'utilisateur authentifié a un token JWT valide
app.get('*', checkUser);

//Middlecare permettant de verifié si un utilisateur est authentifié et que son token JWT est valide
app.get('/jwtid', requireAuthentication, (req: Request, res: Response) => {
    return res.status(200).send(res.locals.user._id);
});

//Router permettant au serveur de servir le frontend du Dashboard
const router = express.Router();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, `./build/`)));

    router.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, './build/index.html'));
    });
};

//Route servant les fichiers statics du dossier 'uploads'
app.use('/uploads', express.static(path.resolve(__dirname, `../uploads/`)));

const apiKey = (req: Request, res: Response, next: NextFunction) => {
    //Nous verifions que la requête n'est pas une image
    //La clé d'API n'étant pas nécessaire
    if (req.originalUrl.includes('/uploads')) {
        next();
    } else {
        //Si le header 'Authorization' est une clé valide
        if (req.get('Authorization') === process.env.API_KEY) {
            //Renvoie la réponse au client
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

app
    //Base d'URL des utilisateurs
    .use('/api/users', apiKey, usersRoutes)
    //Base d'URL des catégories
    .use('/api/categories', apiKey, categoriesRoutes)
    //Base d'URL des produits
    .use('/api/products', apiKey, productsRoutes)
    //Base d'URL des images
    .use('/api/medias', apiKey, mediasRoutes)
    //Base d'URL de la navbar
    .use('/api/navigation', apiKey, navigationRoutes)
    //Base d'URL des pages
    .use('/api/pages', apiKey, pagesRoutes)
    //Base d'URL des clients
    .use('/api/customers', apiKey, customersRoutes)
    //Base d'URL des commandes
    .use('/api/orders', apiKey, ordersRoutes)
    //Base d'URL des transporteurs
    .use('/api/carriers', apiKey, carriersRoutes)
    //Base d'URL des promotions
    .use('/api/promotions', apiKey, promotionsRoutes)
    //Base d'URL des statistiques de produits, commandes et clients
    .use('/api/statistics', apiKey, statisticsRoutes)
    //Base d'URL des paniers
    .use('/api/carts', apiKey, cartRoutes)
    //Base d'URL du paiment
    .use('/api/payment', paymentRoutes)
    //Base d'URL des informations du site e-commerce
    .use('/api/site', siteRoutes)
    .use('/', router);

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

        else if (req.params.id === 'categories')
            await createRandomCategories(10)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'pages')
            await createRandomPages(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'carriers')
            await createRandomCarriers(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        else if (req.params.id === 'carts')
            await createRandomCarts(3)
                .then(docs => res.status(200).send(docs))
                .catch(err => console.log(err))

        res.end();
    })
}

/**
 * 
 */

const PORT = 5555

app.listen(PORT, () => {
    console.log(`Serveur démarré : http://localhost:${PORT}`)
})