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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import OrderModel from '../../models/order.model.js';
import ProductModel from '../../models/product.model.js';
import CustomerModel from "../../models/customer.model.js";
import UserModel from "../../models/user.model.js";
import CarrierModel from "../../models/carrier.model.js";
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function getRandomCustomer() {
    return __awaiter(this, void 0, void 0, function () {
        var customer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, CustomerModel.aggregate([{ $sample: { size: 1 } }])];
                case 1:
                    customer = _a.sent();
                    return [2, {
                            _id: customer[0]._id,
                            name: customer[0].name,
                            lastname: customer[0].lastname,
                            email: customer[0].email,
                            phone: customer[0].phone,
                            title: customer[0].title,
                            addresses: customer[0].addresses
                        }];
            }
        });
    });
}
function getRandomProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var products;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ProductModel.aggregate([{ $sample: { size: randomIntFromInterval(1, 15) } }])];
                case 1:
                    products = _a.sent();
                    return [2, products.map(function (product) {
                            var variant = faker.helpers.arrayElement(__spreadArray([], product.variants, true));
                            return {
                                product: {
                                    _id: product._id
                                },
                                variant: __assign({}, variant),
                                original_price: variant.price,
                                promotion: variant.promotion,
                                price: (variant.price - ((variant.promotion / 100) * variant.price)).toFixed(2),
                                taxe: variant.taxe,
                                quantity: randomIntFromInterval(1, 4)
                            };
                        })];
            }
        });
    });
}
export function getRandomCarrier() {
    return __awaiter(this, void 0, void 0, function () {
        var carrier;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, CarrierModel.aggregate([{ $sample: { size: 1 } }])];
                case 1:
                    carrier = _a.sent();
                    return [2, {
                            _id: carrier[0]._id,
                            price: carrier[0].price
                        }];
            }
        });
    });
}
export function getRandomUser() {
    return __awaiter(this, void 0, void 0, function () {
        var user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, UserModel.aggregate([{ $sample: { size: 1 } }])];
                case 1:
                    user = _a.sent();
                    return [2, {
                            _id: user[0]._id,
                            name: user[0].name,
                            lastname: user[0].lastname,
                            email: user[0].email
                        }];
            }
        });
    });
}
function getStatusBasedOnPayment(payment_status) {
    switch (payment_status) {
        case 'awaiting':
            return ['awaiting'];
        case 'paid':
            return ['accepted', 'preparation', 'completed', 'shipped', 'delivered'];
        case 'canceled':
            return ['canceled'];
        default:
            return ['awaiting'];
    }
}
export function createRandomOrder(numbers, index) {
    return __awaiter(this, void 0, void 0, function () {
        var _id, date, payment_method, customer, address, delivery_address, billing_address, products, carrier, shipping_fees, statusArray, payment_status, status, timeline, price, getPrice, _a, _b, _c, _d, _e, _f, _g, _h, _j, err_1, key, count, err_2;
        var _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    _id = new mongoose.Types.ObjectId();
                    date = faker.date.past(2);
                    payment_method = faker.helpers.arrayElement(['card']);
                    return [4, getRandomCustomer()];
                case 1:
                    customer = _r.sent();
                    address = {
                        name: customer.name,
                        lastname: customer.lastname,
                        society: '',
                        street: faker.address.streetAddress(),
                        complement: faker.address.streetAddress(),
                        postcode: faker.address.zipCode('#####'),
                        city: faker.address.city(),
                        phone: customer.phone
                    };
                    delivery_address = address;
                    billing_address = address;
                    return [4, getRandomProducts()];
                case 2:
                    products = _r.sent();
                    return [4, getRandomCarrier()];
                case 3:
                    carrier = _r.sent();
                    shipping_fees = carrier.price;
                    statusArray = new Date(date).getTime() < (new Date().getTime() - 2 * 24 * 60 * 60 * 1000) ? ['paid'] : ['awaiting', 'paid'];
                    payment_status = faker.helpers.arrayElement(statusArray);
                    status = faker.helpers.arrayElement(getStatusBasedOnPayment(payment_status));
                    timeline = [];
                    price = 0;
                    getPrice = function () {
                        for (var i = 0; i < products.length; i++) {
                            var total = products[i].quantity * products[i].price;
                            price = price + total;
                        }
                    };
                    getPrice();
                    if (payment_status === 'awaiting') {
                        timeline.push({
                            type: "payment_status",
                            status: "awaiting",
                            date: new Date()
                        });
                    }
                    if (payment_status === 'canceled') {
                        timeline.push({
                            type: "payment_status",
                            status: "awaiting",
                            date: new Date()
                        }, {
                            type: "payment_status",
                            status: "canceled",
                            date: new Date()
                        });
                    }
                    if (payment_status === 'paid') {
                        timeline.push({
                            type: "payment_status",
                            status: "awaiting",
                            date: new Date()
                        }, {
                            type: "payment_status",
                            status: "paid",
                            date: new Date()
                        });
                    }
                    if (status === 'accepted') {
                        timeline.push({
                            type: "order_status",
                            status: "accepted",
                            date: new Date()
                        });
                    }
                    if (!(status === 'preparation')) return [3, 5];
                    _b = (_a = timeline).push;
                    _c = [{
                            type: "order_status",
                            status: "accepted",
                            date: new Date()
                        }];
                    _k = {
                        type: "order_status",
                        status: "preparation",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 4:
                    _b.apply(_a, _c.concat([(_k.user = _r.sent(),
                            _k)]));
                    _r.label = 5;
                case 5:
                    if (!(status === 'completed')) return [3, 8];
                    _e = (_d = timeline).push;
                    _f = [{
                            type: "order_status",
                            status: "accepted",
                            date: new Date()
                        }];
                    _l = {
                        type: "order_status",
                        status: "preparation",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 6:
                    _f = _f.concat([(_l.user = _r.sent(),
                            _l)]);
                    _m = {
                        type: "order_status",
                        status: "completed",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 7:
                    _e.apply(_d, _f.concat([(_m.user = _r.sent(),
                            _m)]));
                    _r.label = 8;
                case 8:
                    if (!(status === 'shipped')) return [3, 12];
                    _h = (_g = timeline).push;
                    _j = [{
                            type: "order_status",
                            status: "accepted",
                            date: new Date()
                        }];
                    _o = {
                        type: "order_status",
                        status: "preparation",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 9:
                    _j = _j.concat([(_o.user = _r.sent(),
                            _o)]);
                    _p = {
                        type: "order_status",
                        status: "completed",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 10:
                    _j = _j.concat([(_p.user = _r.sent(),
                            _p)]);
                    _q = {
                        type: "order_status",
                        status: "shipped",
                        date: new Date()
                    };
                    return [4, getRandomUser()];
                case 11:
                    _h.apply(_g, _j.concat([(_q.user = _r.sent(),
                            _q)]));
                    _r.label = 12;
                case 12:
                    _r.trys.push([12, 14, , 15]);
                    return [4, CustomerModel.findByIdAndUpdate({
                            _id: customer._id
                        }, {
                            $addToSet: {
                                orders: _id
                            }
                        }, {
                            new: true,
                            runValidators: true,
                            context: 'query',
                        })];
                case 13:
                    _r.sent();
                    return [3, 15];
                case 14:
                    err_1 = _r.sent();
                    console.log(err_1);
                    return [3, 15];
                case 15:
                    key = 0;
                    _r.label = 16;
                case 16:
                    _r.trys.push([16, 18, , 19]);
                    return [4, OrderModel.countDocuments()];
                case 17:
                    count = _r.sent();
                    key = count + 1;
                    return [3, 19];
                case 18:
                    err_2 = _r.sent();
                    console.log(err_2);
                    return [3, 19];
                case 19: return [2, {
                        _id: _id,
                        key: key,
                        date: date,
                        payment_method: payment_method,
                        delivery_address: delivery_address,
                        billing_address: billing_address,
                        customer: customer,
                        products: products,
                        price: price.toFixed(2),
                        shipping_fees: shipping_fees,
                        carrier: carrier,
                        status: status,
                        payment_status: payment_status,
                        timeline: timeline
                    }];
            }
        });
    });
}
export function createRandomOrders(length) {
    return __awaiter(this, void 0, void 0, function () {
        var response, i, order;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = [];
                    console.log(length);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < length)) return [3, 5];
                    return [4, createRandomOrder(length, i)];
                case 2:
                    order = _a.sent();
                    return [4, OrderModel.create(__assign({}, order))
                            .then(function (docs) {
                            response = __spreadArray(__spreadArray([], response, true), [docs], false);
                        })
                            .catch(function (err) { throw new Error(err); })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3, 1];
                case 5: return [2, response];
            }
        });
    });
}
