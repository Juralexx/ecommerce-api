var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
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
var __dirname = path.dirname(fileURLToPath(import.meta.url));
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
var app = express();
var _a = process.env, NODE_ENV = _a.NODE_ENV, DEV_SERVER_URL = _a.DEV_SERVER_URL, SERVER_URL = _a.SERVER_URL, DEV_DASHBOARD_URL = _a.DEV_DASHBOARD_URL, DASHBOARD_URL = _a.DASHBOARD_URL, DEV_SITE_URL = _a.DEV_SITE_URL, SITE_URL = _a.SITE_URL;
var SERVER = NODE_ENV !== 'production' ? DEV_SERVER_URL : SERVER_URL;
var DASHBOARD = NODE_ENV !== 'production' ? DEV_DASHBOARD_URL : DASHBOARD_URL;
var SITE = NODE_ENV !== 'production' ? DEV_SITE_URL : SITE_URL;
var whitelist = [SERVER, DASHBOARD, SITE, 'https://checkout.stripe.com/'];
app
    .use(cors({
    'credentials': true,
    'origin': function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    },
    'allowedHeaders': ['Content-Length', 'Content-Type', 'application', 'Authorization', 'AuthType'],
    'methods': ['GET', 'PUT', 'POST', 'DELETE']
}))
    .all('*', function (req, res, next) {
    var origin = req.headers.origin;
    if (whitelist.indexOf(origin) >= 0) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
    .use(helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: false,
    frameguard: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: true
}))
    .use(bodyParser.json({
    limit: '500kb',
    verify: function (req, res, buf) {
        req.rawBody = buf;
    }
}))
    .use(bodyParser.urlencoded({
    extended: false,
    limit: '500kb'
}))
    .use(express.json({
    limit: '500kb'
}))
    .use(cookieParser());
var limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too Many Request from this IP, your IP has been blocked.\n    Please try again later."
});
var hppProtector = function (req, res, next) {
    if (req.query) {
        for (var _i = 0, _a = Object.entries(req.query); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (typeof value !== 'string' && typeof value !== 'number') {
                if (Array.isArray(value)) {
                    req.query[key] = value[0];
                }
                else {
                    return res.status(400).json({
                        error: "Le param\u00E8tre '".concat(key, "' n'est pas valide.")
                    });
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    next();
};
app
    .use(compression())
    .use(limiter)
    .use(hppProtector)
    .use(mongoSanitize({ allowDots: true }));
app
    .get('/*', checkUser)
    .get('*', function (req, res, next) {
    console.log(req.originalUrl);
    next();
});
app.get('/jwtid', requireAuthentication, function (req, res) {
    return res.status(200).send(res.locals.user._id);
});
app.use('/uploads', express.static(path.resolve(__dirname, "../uploads/")));
var useApiKey = function (req, res, next) {
    if (req.originalUrl.includes('/uploads')) {
        next();
    }
    else {
        if (req.get('Authorization') === process.env.API_KEY) {
            res.flush();
            next();
        }
        else {
            return res.status(401).json({
                status: "error",
                message: "Invalid credentials."
            });
        }
        ;
    }
    ;
};
export var cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
var useCaches = function (req, res, next) {
    if (req.method === 'GET' && req.originalUrl !== '/jwtid') {
        var requestedUrl = req.originalUrl;
        if (cache.has(requestedUrl)) {
            res.send(cache.get(requestedUrl));
            res.end();
        }
        else {
            next();
        }
    }
    else {
        next();
    }
    ;
};
app
    .use('/api/users', useApiKey, usersRoutes)
    .use('/api/categories', useApiKey, categoriesRoutes)
    .use('/api/products', useApiKey, productsRoutes)
    .use('/api/medias', useApiKey, mediasRoutes)
    .use('/api/navigation', useApiKey, useCaches, navigationRoutes)
    .use('/api/pages', useApiKey, useCaches, pagesRoutes)
    .use('/api/customers', useApiKey, customersRoutes)
    .use('/api/orders', useApiKey, ordersRoutes)
    .use('/api/carriers', useApiKey, useCaches, carriersRoutes)
    .use('/api/promotions', useApiKey, useCaches, promotionsRoutes)
    .use('/api/statistics', useApiKey, useCaches, statisticsRoutes)
    .use('/api/carts', useApiKey, useCaches, cartRoutes)
    .use('/api/payment', paymentRoutes)
    .use('/api/checkouts', useApiKey, checkoutRoutes)
    .use('/api/site', siteRoutes);
if (NODE_ENV !== 'production') {
    app.get('/create/fake/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(req.params.id === 'users')) return [3, 2];
                    return [4, createRandomUsers(2)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = userErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 1:
                    _a.sent();
                    return [3, 18];
                case 2:
                    if (!(req.params.id === 'customers')) return [3, 4];
                    return [4, createRandomCustomers(100)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = customerErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 3:
                    _a.sent();
                    return [3, 18];
                case 4:
                    if (!(req.params.id === 'products')) return [3, 6];
                    return [4, createRandomProducts(1)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = productErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 5:
                    _a.sent();
                    return [3, 18];
                case 6:
                    if (!(req.params.id === 'orders')) return [3, 8];
                    return [4, createRandomOrders(500)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) { return console.log(err); })];
                case 7:
                    _a.sent();
                    return [3, 18];
                case 8:
                    if (!(req.params.id === 'promotions')) return [3, 10];
                    return [4, createRandomPromotions(3)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = promotionsErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 9:
                    _a.sent();
                    return [3, 18];
                case 10:
                    if (!(req.params.id === 'categories')) return [3, 12];
                    return [4, createRandomCategories(10)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = categoryErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 11:
                    _a.sent();
                    return [3, 18];
                case 12:
                    if (!(req.params.id === 'pages')) return [3, 14];
                    return [4, createRandomPages(30)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = pageErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 13:
                    _a.sent();
                    return [3, 18];
                case 14:
                    if (!(req.params.id === 'carriers')) return [3, 16];
                    return [4, createRandomCarriers(3)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) {
                            var errors = carrierErrors(err);
                            return res.status(400).send({ errors: errors });
                        })];
                case 15:
                    _a.sent();
                    return [3, 18];
                case 16:
                    if (!(req.params.id === 'carts')) return [3, 18];
                    return [4, createRandomCarts(1)
                            .then(function (docs) { return res.status(200).send(docs); })
                            .catch(function (err) { return console.log(err); })];
                case 17:
                    _a.sent();
                    _a.label = 18;
                case 18:
                    res.end();
                    return [2];
            }
        });
    }); });
}
;
var PORT = process.env.PORT || 5005;
app.listen(PORT, function () {
    console.log("Serveur d\u00E9marr\u00E9 : http://localhost:".concat(PORT));
});
