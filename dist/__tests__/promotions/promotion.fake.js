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
import PromotionModel from '../../models/promotion.model.js';
import ProductModel from '../../models/product.model.js';
import CategoryModel from "../../models/category.model.js";
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomProducts() {
    return __awaiter(this, void 0, void 0, function () {
        var products;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, ProductModel.aggregate([{ $sample: { size: randomIntFromInterval(0, 15) } }])];
                case 1:
                    products = _a.sent();
                    return [2, products.map(function (product) {
                            return {
                                _id: product._id
                            };
                        })];
            }
        });
    });
}
export function getRandomCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var categories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, CategoryModel.aggregate([{ $sample: { size: randomIntFromInterval(0, 3) } }])];
                case 1:
                    categories = _a.sent();
                    return [2, categories.map(function (category) {
                            return {
                                _id: category._id
                            };
                        })];
            }
        });
    });
}
export function createRandomPromotion() {
    return __awaiter(this, void 0, void 0, function () {
        var _id, type, value, code, description, dates, start_date, end_date, is_active, condition, _a;
        var _b;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _id = new mongoose.Types.ObjectId();
                    type = faker.helpers.arrayElement(['percentage', 'fixed']);
                    value = faker.helpers.arrayElement([10, 20, 30]);
                    code = faker.lorem.words(1).toUpperCase() + value;
                    description = faker.lorem.sentence();
                    dates = faker.date.betweens('2022-12-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z', 2);
                    start_date = dates[0];
                    end_date = dates[1];
                    is_active = false;
                    if (start_date < new Date() && end_date > new Date()) {
                        is_active = true;
                    }
                    condition = {
                        type: faker.helpers.arrayElement(['all', 'products', 'categories']),
                        products: [],
                        categories: []
                    };
                    if (!(condition.type !== 'all')) return [3, 3];
                    _a = [__assign({}, condition)];
                    _b = {};
                    return [4, getRandomProducts()];
                case 1:
                    _b.products = _c.sent();
                    return [4, getRandomCategories()];
                case 2:
                    condition = __assign.apply(void 0, _a.concat([(_b.categories = _c.sent(), _b)]));
                    _c.label = 3;
                case 3:
                    ;
                    if (!(condition.type !== 'all')) return [3, 4];
                    if (condition.categories.length > 0) {
                        condition.categories.forEach(function (category) { return __awaiter(_this, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4, ProductModel.updateMany({
                                                category: category._id
                                            }, {
                                                $addToSet: {
                                                    promotions: _id,
                                                },
                                            }, {
                                                new: true,
                                                runValidators: true,
                                                context: 'query',
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [3, 3];
                                    case 2:
                                        err_1 = _a.sent();
                                        console.log(err_1);
                                        return [3, 3];
                                    case 3: return [2];
                                }
                            });
                        }); });
                    }
                    if (condition.products.length > 0) {
                        condition.products.forEach(function (product) { return __awaiter(_this, void 0, void 0, function () {
                            var err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4, ProductModel.findByIdAndUpdate({
                                                _id: product._id
                                            }, {
                                                $addToSet: {
                                                    promotions: _id,
                                                },
                                            }, {
                                                new: true,
                                                runValidators: true,
                                                context: 'query',
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [3, 3];
                                    case 2:
                                        err_2 = _a.sent();
                                        console.log(err_2);
                                        return [3, 3];
                                    case 3: return [2];
                                }
                            });
                        }); });
                    }
                    return [3, 6];
                case 4: return [4, ProductModel.updateMany({
                        $addToSet: {
                            promotions: _id,
                        },
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2, {
                        _id: _id,
                        type: type,
                        code: code,
                        value: value,
                        description: description,
                        start_date: start_date,
                        end_date: end_date,
                        condition: condition,
                        is_active: is_active
                    }];
            }
        });
    });
}
export function createRandomPromotions(length) {
    return __awaiter(this, void 0, void 0, function () {
        var response, i, promotion;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < length)) return [3, 5];
                    return [4, createRandomPromotion()];
                case 2:
                    promotion = _a.sent();
                    return [4, PromotionModel.create(__assign({}, promotion))
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
