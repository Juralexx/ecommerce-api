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
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import { convertStringToRegexp, onlyNumbers, sanitize } from '../utils/utils.js';
import { sendOrderInPreparationEmail, sendOrderShippedEmail } from '../email/email.controller.js';
import { cache } from '../app.js';
export var getOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queries, options, q, regex, startDate, endDate, startDate, endDate, count, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queries = {};
                options = {
                    p: 1,
                    limit: 24,
                    sort: { '_id': -1 }
                };
                if (req.query) {
                    if (req.query.limit) {
                        options.limit = sanitize(String(req.query.limit));
                        options.limit = Number(options.limit);
                    }
                    if (req.query.sort) {
                        options.sort = sanitize(String(req.query.sort));
                    }
                    if (req.query.p && onlyNumbers(req.query.p)) {
                        options.p = Number(req.query.p);
                    }
                    if (req.query.select) {
                        options.select = sanitize(String(req.query.select));
                    }
                    if (req.query.q) {
                        q = sanitize(String(req.query.q));
                        regex = convertStringToRegexp(q);
                        queries = __assign(__assign({}, queries), { "$or": [
                                { "payment_method": { "$regex": regex } },
                                { "payment_status": { "$regex": regex } },
                                { "status": { "$regex": regex } },
                            ] });
                    }
                    ;
                    ['status', 'payment_status', 'payment_method', 'carrier']
                        .forEach(function (type) {
                        var _a, _b;
                        if (req.query[type]) {
                            var isMultiple = req.query[type].toString().split(',');
                            if (isMultiple.length > 1) {
                                queries = __assign(__assign({}, queries), (_a = {}, _a[type] = isMultiple, _a));
                            }
                            else {
                                queries = __assign(__assign({}, queries), (_b = {}, _b[type] = req.query[type], _b));
                            }
                            ;
                        }
                        ;
                    });
                    if (req.query.from) {
                        if (Date.parse(req.query.from.toString())) {
                            if (!req.query.to) {
                                startDate = new Date(req.query.from.toString());
                                endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
                                queries = __assign(__assign({}, queries), { "date": {
                                        $gte: startDate,
                                        $lte: endDate
                                    } });
                            }
                            else {
                                if (Date.parse(req.query.to.toString())) {
                                    startDate = new Date(req.query.from.toString());
                                    endDate = new Date(req.query.to.toString());
                                    queries = __assign(__assign({}, queries), { "date": {
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
                return [4, OrderModel.countDocuments(queries)];
            case 1:
                count = _a.sent();
                if (options.p) {
                    if (options.p > Math.ceil(count / options.limit)) {
                        options.p = Math.ceil(count / options.limit);
                    }
                    if (options.p < 1) {
                        options.p = 1;
                    }
                }
                ;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4, OrderModel
                        .find(queries)
                        .sort(options.sort)
                        .limit(options.limit)
                        .skip((options.p - 1) * options.limit)
                        .populate({
                        path: 'customer',
                        select: '-password'
                    })
                        .populate('carrier')
                        .populate({
                        path: 'products.product',
                        select: '_id ref name category price stock promotion images',
                        populate: [
                            {
                                path: 'images',
                                select: '_id name path',
                            },
                            {
                                path: 'category',
                                select: '_id name parent link',
                            }
                        ]
                    })
                        .select(options.select)
                        .then(function (docs) {
                        cache.set(req.originalUrl, JSON.stringify({
                            documents: docs,
                            count: count,
                            currentPage: options.p,
                            limit: options.limit
                        }));
                        return res.status(200).send({
                            documents: docs,
                            count: count,
                            currentPage: options.p,
                            limit: options.limit
                        });
                    })];
            case 3:
                _a.sent();
                return [3, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                return [2, res.status(400).send({ message: err_1 })];
            case 5:
                ;
                return [2];
        }
    });
}); };
export var createOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, customer = _a.customer, date = _a.date, payment_method = _a.payment_method, delivery_address = _a.delivery_address, billing_address = _a.billing_address, products = _a.products, price = _a.price, shipping_fees = _a.shipping_fees, carrier = _a.carrier, status = _a.status, timeline = _a.timeline;
                return [4, OrderModel.create({
                        customer: customer,
                        date: date,
                        payment_method: payment_method,
                        delivery_address: delivery_address,
                        billing_address: billing_address,
                        products: products,
                        price: price,
                        shipping_fees: shipping_fees,
                        carrier: carrier,
                        status: status,
                        timeline: timeline
                    })
                        .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, CustomerModel.findByIdAndUpdate({
                                        _id: customer._id
                                    }, {
                                        $addToSet: {
                                            orders: docs._id
                                        }
                                    }, {
                                        new: true,
                                        runValidators: true,
                                        context: 'query',
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2, res.send(docs)];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        return res.status(400).send({ message: err });
                    })];
            case 1:
                _b.sent();
                return [2];
        }
    });
}); };
export var updateOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, customer, date, payment_method, delivery_address, billing_address, products, price, shipping_fees, carrier, status, timeline;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, customer = _a.customer, date = _a.date, payment_method = _a.payment_method, delivery_address = _a.delivery_address, billing_address = _a.billing_address, products = _a.products, price = _a.price, shipping_fees = _a.shipping_fees, carrier = _a.carrier, status = _a.status, timeline = _a.timeline;
                if (!status) return [3, 4];
                if (!(status === 'preparation')) return [3, 2];
                return [4, OrderModel
                        .findById(req.params.id)
                        .populate('customer')
                        .then(function (doc) {
                        return sendOrderInPreparationEmail(doc);
                    })
                        .catch(function (err) { return console.log(err); })];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2:
                if (!(status === 'shipped')) return [3, 4];
                return [4, OrderModel
                        .findById(req.params.id)
                        .populate('customer')
                        .then(function (doc) {
                        return sendOrderShippedEmail(doc);
                    })
                        .catch(function (err) { return console.log(err); })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                ;
                if (!req.params.id) return [3, 8];
                if (!!ObjectID.isValid(req.params.id)) return [3, 5];
                return [2, res.status(400).send("ID unknown : " + req.params.id)];
            case 5: return [4, OrderModel.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {
                        customer: customer,
                        date: date,
                        payment_method: payment_method,
                        delivery_address: delivery_address,
                        billing_address: billing_address,
                        products: products,
                        price: price,
                        shipping_fees: shipping_fees,
                        carrier: carrier,
                        status: status,
                    },
                    $addToSet: {
                        timeline: timeline
                    }
                }, {
                    new: true,
                    runValidators: true,
                    context: 'query',
                })
                    .then(function (docs) {
                    cache.del("/api/orders");
                    cache.del("/api/orders/".concat(req.params.id));
                    return res.send(docs);
                })
                    .catch(function (err) {
                    return res.status(400).send({ message: err });
                })];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                ;
                _b.label = 8;
            case 8:
                ;
                return [2];
        }
    });
}); };
