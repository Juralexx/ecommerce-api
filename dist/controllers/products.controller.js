var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import mongoose from 'mongoose';
var ObjectID = mongoose.Types.ObjectId;
import ProductModel from '../models/product.model.js';
import { productErrors } from '../errors/products.errors.js';
import { convertStringToRegexp, convertStringToURL, onlyNumbers, randomNbID, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';
export var getProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queries, options, isArray, direction, query, q, regex, categoryId, published, promotion, startDate, endDate, startDate, endDate, count, err_1, products, err_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                queries = {};
                options = {
                    p: 1,
                    limit: 24,
                    sort: 'name'
                };
                if (req.query) {
                    if (req.query.limit) {
                        options.limit = sanitize(String(req.query.limit));
                        options.limit = Number(options.limit);
                    }
                    if (req.query.sort) {
                        options.sort = sanitize(String(req.query.sort));
                        isArray = options.sort.split('.');
                        if (isArray.length > 0) {
                            direction = isArray[isArray.length - 1];
                            if (direction === 'asc' || direction === 'desc') {
                                query = isArray
                                    .slice(0, isArray.length - 1)
                                    .map(function (value) { return value; })
                                    .join('.');
                                options.sort = (_a = {}, _a[query] = direction, _a);
                            }
                        }
                    }
                    if (req.query.minprice && req.query.maxprice) {
                        if (onlyNumbers(req.query.minprice) && onlyNumbers(req.query.maxprice)) {
                            queries = __assign(__assign({}, queries), { "base_variant.price": {
                                    '$gte': Number(req.query.minprice),
                                    '$lte': Number(req.query.maxprice),
                                } });
                        }
                    }
                    if (req.query.minprice && !req.query.maxprice) {
                        if (onlyNumbers(req.query.minprice)) {
                            queries = __assign(__assign({}, queries), { "base_variant.price": {
                                    '$gte': Number(req.query.minprice)
                                } });
                        }
                    }
                    if (!req.query.minprice && req.query.maxprice) {
                        if (onlyNumbers(req.query.maxprice)) {
                            queries = __assign(__assign({}, queries), { "base_variant.price": {
                                    '$lte': Number(req.query.maxprice)
                                } });
                        }
                    }
                    if (req.query.p && onlyNumbers(req.query.p)) {
                        options.p = Number(req.query.p);
                    }
                    if (req.query.populate) {
                        options.populate = sanitize(String(req.query.populate));
                    }
                    if (req.query.select) {
                        options.select = sanitize(String(req.query.select));
                    }
                    if (req.query.q) {
                        q = sanitize((req.query.q).toString());
                        regex = convertStringToRegexp(q);
                        queries = __assign(__assign({}, queries), { "name": { "$regex": regex } });
                    }
                    if (req.query.category) {
                        options.category = sanitize(String(req.query.category));
                    }
                    if (req.query.categoryId) {
                        categoryId = sanitize(String(req.query.categoryId));
                        queries = __assign(__assign({}, queries), { "category": categoryId });
                    }
                    if (req.query.stock) {
                        if (req.query.stock == 'in') {
                            queries = __assign(__assign({}, queries), { "stock": { '$gt': 0 } });
                        }
                        if (req.query.stock == 'out') {
                            queries = __assign(__assign({}, queries), { "stock": { '$eq': 0 } });
                        }
                    }
                    if (req.query.published) {
                        published = req.query.published.toString();
                        if (published === 'true' || published === 'false') {
                            options.published = published;
                        }
                    }
                    if (req.query.promotion) {
                        promotion = sanitize(String(req.query.promotion));
                        if (promotion !== 'all') {
                            queries = __assign(__assign({}, queries), { "promotions": promotion });
                        }
                    }
                    if (req.query.from) {
                        if (Date.parse(req.query.from.toString())) {
                            if (!req.query.to) {
                                startDate = new Date(req.query.from.toString());
                                endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
                                queries = __assign(__assign({}, queries), { "createdAt": {
                                        $gte: startDate,
                                        $lte: endDate
                                    } });
                            }
                            else {
                                if (Date.parse(req.query.to.toString())) {
                                    startDate = new Date(req.query.from.toString());
                                    endDate = new Date(req.query.to.toString());
                                    queries = __assign(__assign({}, queries), { "createdAt": {
                                            $gte: startDate,
                                            $lte: endDate
                                        } });
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                }
                ;
                if (options.published) {
                    queries = __assign(__assign({}, queries), { "published": options.published || true });
                }
                return [4, ProductModel.countDocuments(queries)];
            case 1:
                count = _c.sent();
                if (options.p) {
                    if (options.p > Math.ceil(count / options.limit)) {
                        options.p = Math.ceil(count / options.limit);
                    }
                    if (options.p < 1) {
                        options.p = 1;
                    }
                }
                ;
                if (!!options.category) return [3, 6];
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4, ProductModel
                        .find(queries)
                        .limit(options.limit)
                        .skip((options.p - 1) * options.limit)
                        .populate({
                        path: 'images',
                    })
                        .populate({
                        path: 'category',
                        select: '_id name parent link'
                    })
                        .populate({
                        path: 'promotions',
                        select: '_id type code value description start_date end_date is_active'
                    })
                        .populate(options.populate)
                        .select(options.select)
                        .sort(options.sort)
                        .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            cache.set(req.originalUrl, JSON.stringify({
                                documents: docs,
                                count: count,
                                currentPage: options.p,
                                limit: options.limit
                            }));
                            return [2, res.status(200).send({
                                    documents: docs,
                                    count: count,
                                    currentPage: options.p,
                                    limit: options.limit
                                })];
                        });
                    }); })];
            case 3:
                _c.sent();
                return [3, 5];
            case 4:
                err_1 = _c.sent();
                return [2, res.status(400).send({ message: err_1 })];
            case 5: return [3, 10];
            case 6:
                _c.trys.push([6, 9, , 10]);
                return [4, ProductModel.aggregate([
                        {
                            $lookup: {
                                from: 'categories',
                                localField: 'category',
                                foreignField: '_id',
                                as: 'category'
                            }
                        }, {
                            $unwind: '$category'
                        }, {
                            $match: {
                                "$or": [
                                    {
                                        'category.name': options.category
                                    }, {
                                        'category._id': options.category
                                    }
                                ]
                            }
                        }, {
                            $limit: options.limit
                        }, {
                            $skip: (options.p - 1) * options.limit
                        }, {
                            $sort: (_b = {},
                                _b[options.sort] = 1,
                                _b)
                        }, {
                            $project: {
                                "description": 0,
                                "content": 0
                            }
                        }
                    ])
                        .exec()];
            case 7:
                products = _c.sent();
                return [4, ProductModel
                        .populate(products, [
                        {
                            path: 'images',
                        }, {
                            path: 'category',
                            select: '_id name parent link'
                        }, {
                            path: 'promotions',
                            select: '_id type code value description start_date end_date is_active'
                        }
                    ])
                        .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            cache.set(req.originalUrl, JSON.stringify({
                                documents: docs,
                                count: count,
                                currentPage: options.p,
                                limit: options.limit
                            }));
                            return [2, res.status(200).send({
                                    documents: docs,
                                    count: count,
                                    currentPage: options.p,
                                    limit: options.limit
                                })];
                        });
                    }); })];
            case 8:
                _c.sent();
                return [3, 10];
            case 9:
                err_2 = _c.sent();
                return [2, res.status(400).send({ message: err_2 })];
            case 10: return [2];
        }
    });
}); };
export var getProductByUrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, current_variant, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.params.url) {
                    return [2, res.status(400).send('Unknown URL : ' + req.params.id)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, ProductModel
                        .findOne({
                        "variants.url": req.params.url
                    })
                        .populate('images category promotions')
                        .exec()];
            case 2:
                response = _a.sent();
                current_variant = {};
                if (response) {
                    current_variant = response.variants.find(function (variant) { return variant.url === req.params.url; });
                }
                cache.set(req.originalUrl, JSON.stringify(__assign(__assign({}, response._doc), { current_variant: current_variant })));
                res.status(200).send(__assign(__assign({}, response._doc), { current_variant: current_variant }));
                return [3, 4];
            case 3:
                err_3 = _a.sent();
                return [2, res.status(400).send({ message: err_3 })];
            case 4: return [2];
        }
    });
}); };
export var createProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, content, description, category, images, details, variants, i, _b, price, taxe, ref, size, height, weight, barcode, url, base_variant;
    var _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = req.body, name = _a.name, content = _a.content, description = _a.description, category = _a.category, images = _a.images, details = _a.details, variants = _a.variants;
                if (variants) {
                    if (variants.length > 0) {
                        for (i = 0; i < variants.length; i++) {
                            _b = variants[i], price = _b.price, taxe = _b.taxe, ref = _b.ref, size = _b.size, height = _b.height, weight = _b.weight, barcode = _b.barcode;
                            if (size.length === 0)
                                return [2, res.status(400).send({ errors: (_c = {}, _c["size-".concat(i)] = 'Veuillez préciser le litrage du produit.', _c) })];
                            if (height.length === 0)
                                return [2, res.status(400).send({ errors: (_d = {}, _d["height-".concat(i)] = 'Veuillez préciser la hauteur du produit.', _d) })];
                            if (weight.length === 0)
                                return [2, res.status(400).send({ errors: (_e = {}, _e["weight-".concat(i)] = 'Veuillez préciser le poids du produit.', _e) })];
                            if (!price || price < 1)
                                return [2, res.status(400).send({ errors: (_f = {}, _f["price-".concat(i)] = 'Veuillez saisir un prix valide.', _f) })];
                            if (taxe === 0)
                                return [2, res.status(400).send({ errors: (_g = {}, _g["taxe-".concat(i)] = 'Veuillez saisir la taxe appliquée au produit.', _g) })];
                            if (ref.length === 0)
                                return [2, res.status(400).send({ errors: (_h = {}, _h["ref-".concat(i)] = 'Veuillez saisir la référence du produit.', _h) })];
                            if (barcode.length === 0)
                                return [2, res.status(400).send({ errors: (_j = {}, _j["barcode-".concat(i)] = 'Veuillez préciser le code barre du produit.', _j) })];
                            if (name) {
                                url = convertStringToURL(name);
                                variants[i].url = "".concat(url, "-").concat(randomNbID(8));
                            }
                        }
                    }
                    else {
                        return [2, res.status(400).send({
                                errors: { variants: 'Veuillez ajouter au moins un variant.' }
                            })];
                    }
                }
                base_variant = variants.reduce(function (prev, curr) { return (prev.price < curr.price ? prev : curr); });
                return [4, ProductModel.create({
                        name: name,
                        category: category,
                        content: content,
                        description: description,
                        variants: variants,
                        base_variant: base_variant,
                        images: images,
                        details: details
                    })
                        .then(function (docs) {
                        return res.send(docs);
                    })
                        .catch(function (err) {
                        var errors = productErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 1:
                _k.sent();
                return [2];
        }
    });
}); };
export var updateProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, published, name, content, description, category, images, details, promotions, variants, i, url, _b, price, taxe, ref, size, height, weight, barcode, base_variant;
    var _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _a = req.body, published = _a.published, name = _a.name, content = _a.content, description = _a.description, category = _a.category, images = _a.images, details = _a.details, promotions = _a.promotions, variants = _a.variants;
                if (!req.params.id) return [3, 4];
                if (!!ObjectID.isValid(req.params.id)) return [3, 1];
                return [2, res.status(400).send("ID unknown : " + req.params.id)];
            case 1:
                if (variants) {
                    if (variants.length > 0) {
                        for (i = 0; i < variants.length; i++) {
                            if (name) {
                                url = convertStringToURL(name);
                                variants[i].url = "".concat(url, "-").concat(randomNbID(8));
                            }
                            _b = variants[i], price = _b.price, taxe = _b.taxe, ref = _b.ref, size = _b.size, height = _b.height, weight = _b.weight, barcode = _b.barcode;
                            if (size.length === 0)
                                return [2, res.status(400).send({ errors: (_c = {}, _c["size-".concat(i)] = 'Veuillez préciser le litrage du produit.', _c) })];
                            if (height.length === 0)
                                return [2, res.status(400).send({ errors: (_d = {}, _d["height-".concat(i)] = 'Veuillez préciser la hauteur du produit.', _d) })];
                            if (weight.length === 0)
                                return [2, res.status(400).send({ errors: (_e = {}, _e["weight-".concat(i)] = 'Veuillez préciser le poids du produit.', _e) })];
                            if (!price || price < 1)
                                return [2, res.status(400).send({ errors: (_f = {}, _f["price-".concat(i)] = 'Veuillez saisir un prix valide.', _f) })];
                            if (taxe === 0)
                                return [2, res.status(400).send({ errors: (_g = {}, _g["taxe-".concat(i)] = 'Veuillez saisir la taxe appliquée au produit.', _g) })];
                            if (ref.length === 0)
                                return [2, res.status(400).send({ errors: (_h = {}, _h["ref-".concat(i)] = 'Veuillez saisir la référence du produit.', _h) })];
                            if (barcode.length === 0)
                                return [2, res.status(400).send({ errors: (_j = {}, _j["barcode-".concat(i)] = 'Veuillez préciser le code barre du produit.', _j) })];
                        }
                    }
                    else {
                        return [2, res.status(400).send({ errors: { variants: 'Veuillez ajouter au moins un variant.' } })];
                    }
                }
                base_variant = void 0;
                if (variants && variants.length > 0) {
                    base_variant = variants.reduce(function (prev, curr) { return prev.price < curr.price ? prev : curr; });
                }
                return [4, ProductModel.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $set: {
                            published: published,
                            name: name,
                            content: content,
                            description: description,
                            category: category,
                            variants: variants,
                            base_variant: base_variant,
                            images: images,
                            details: details,
                            promotions: promotions
                        },
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })
                        .then(function (docs) {
                        cache.del("/api/products");
                        cache.del("/api/products/".concat(req.params.id));
                        return res.send(docs);
                    })
                        .catch(function (err) {
                        var errors = productErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 2:
                _k.sent();
                _k.label = 3;
            case 3:
                ;
                _k.label = 4;
            case 4:
                ;
                return [2];
        }
    });
}); };
