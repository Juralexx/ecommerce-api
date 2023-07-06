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
import mongoose from 'mongoose';
var ObjectID = mongoose.Types.ObjectId;
import PromotionModel from "../models/promotion.model.js";
import { promotionsErrors } from '../errors/promotion.errors.js';
import ProductModel from '../models/product.model.js';
import CategoryModel from '../models/category.model.js';
import { cache } from '../app.js';
export var createPromotion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, code, value, description, start_date, end_date, condition, products;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, type = _a.type, code = _a.code, value = _a.value, description = _a.description, start_date = _a.start_date, end_date = _a.end_date, condition = _a.condition;
                products = [];
                if (condition.categories.length > 0) {
                    condition.categories.forEach(function (category) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, ProductModel
                                        .find({ category: category._id })
                                        .then(function (docs) {
                                        docs.forEach(function (doc) {
                                            products = __spreadArray(__spreadArray([], products, true), [doc._id], false);
                                        });
                                    })
                                        .catch(function (err) { return console.log(err); })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); });
                    condition.products = __spreadArray(__spreadArray([], condition.products, true), products, true);
                    condition.products = condition.products.filter(function (value, index, array) { return array.indexOf(value) === index; });
                }
                ;
                return [4, PromotionModel.create({
                        type: type,
                        code: code,
                        value: value,
                        description: description,
                        start_date: start_date,
                        end_date: end_date,
                        condition: condition
                    })
                        .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(condition.type !== 'all')) return [3, 1];
                                    if (condition.categories.length > 0) {
                                        condition.categories.forEach(function (category) { return __awaiter(void 0, void 0, void 0, function () {
                                            var err_1;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4, ProductModel.updateMany({
                                                                category: category._id
                                                            }, {
                                                                $addToSet: {
                                                                    promotions: docs._id,
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
                                                        return [2, res.status(400).send({ message: err_1 })];
                                                    case 3: return [2];
                                                }
                                            });
                                        }); });
                                    }
                                    if (condition.products.length > 0) {
                                        condition.products.forEach(function (product) { return __awaiter(void 0, void 0, void 0, function () {
                                            var err_2;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 3]);
                                                        return [4, ProductModel.findByIdAndUpdate({
                                                                _id: product._id
                                                            }, {
                                                                $addToSet: {
                                                                    promotions: docs._id,
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
                                                        return [2, res.status(400).send({ message: err_2 })];
                                                    case 3: return [2];
                                                }
                                            });
                                        }); });
                                    }
                                    return [3, 3];
                                case 1: return [4, ProductModel.updateMany({
                                        $addToSet: {
                                            promotions: docs._id,
                                        },
                                    }, {
                                        new: true,
                                        runValidators: true,
                                        context: 'query',
                                    })];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2, res.send(docs)];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        var errors = promotionsErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 1:
                _b.sent();
                return [2];
        }
    });
}); };
var updatePromotionInCollections = function (res, model, promotion, elements) { return __awaiter(void 0, void 0, void 0, function () {
    var promotionsToAdd, promotionsToRemove;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                promotionsToAdd = [];
                promotionsToRemove = [];
                return [4, model
                        .find()
                        .select('_id promotions')
                        .then(function (res) {
                        if (res.length > 0) {
                            res.forEach(function (el) {
                                var isProductInPromotion = elements.some(function (e) { return e._id.toString() === el._id.toString(); });
                                var isPromotionInProduct = el.promotions.some(function (prom) { return prom._id.toString() === promotion._id.toString(); });
                                if (isProductInPromotion && !isPromotionInProduct) {
                                    promotionsToAdd = __spreadArray(__spreadArray([], promotionsToAdd, true), [el], false);
                                }
                                else if (!isProductInPromotion && isPromotionInProduct) {
                                    promotionsToRemove = __spreadArray(__spreadArray([], promotionsToRemove, true), [el], false);
                                }
                            });
                        }
                    })];
            case 1:
                _a.sent();
                promotionsToAdd.forEach(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                    var err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4, model.findByIdAndUpdate({
                                        _id: element._id
                                    }, {
                                        $addToSet: {
                                            promotions: promotion._id,
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
                                err_3 = _a.sent();
                                return [2, res.status(400).send({ message: err_3 })];
                            case 3: return [2];
                        }
                    });
                }); });
                promotionsToRemove.forEach(function (element) { return __awaiter(void 0, void 0, void 0, function () {
                    var err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4, model.findByIdAndUpdate({
                                        _id: element._id
                                    }, {
                                        $pull: {
                                            promotions: promotion._id,
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
                                err_4 = _a.sent();
                                return [2, res.status(400).send({ message: err_4 })];
                            case 3: return [2];
                        }
                    });
                }); });
                return [2];
        }
    });
}); };
export var updatePromotion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, code, value, description, start_date, end_date, condition, is_active, products;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, type = _a.type, code = _a.code, value = _a.value, description = _a.description, start_date = _a.start_date, end_date = _a.end_date, condition = _a.condition, is_active = _a.is_active;
                products = [];
                if (condition && ((_b = condition === null || condition === void 0 ? void 0 : condition.categories) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    condition.categories.forEach(function (category) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4, ProductModel
                                        .find({ category: category._id })
                                        .then(function (docs) {
                                        docs.forEach(function (doc) {
                                            products = __spreadArray(__spreadArray([], products, true), [doc._id], false);
                                        });
                                    })
                                        .catch(function (err) { return console.log(err); })];
                                case 1:
                                    _a.sent();
                                    return [2];
                            }
                        });
                    }); });
                    condition.products = __spreadArray(__spreadArray([], condition.products, true), products, true);
                    condition.products = condition.products.filter(function (value, index, array) { return array.indexOf(value) === index; });
                }
                ;
                if (!req.params.id) return [3, 3];
                if (!!ObjectID.isValid(req.params.id)) return [3, 1];
                return [2, res.status(400).send("ID unknown : " + req.params.id)];
            case 1: return [4, PromotionModel.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {
                        type: type,
                        code: code,
                        value: value,
                        description: description,
                        start_date: start_date,
                        end_date: end_date,
                        condition: condition,
                        is_active: is_active
                    },
                }, {
                    new: true,
                    runValidators: true,
                    context: 'query',
                })
                    .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!condition) return [3, 6];
                                if (!condition.products) return [3, 2];
                                return [4, updatePromotionInCollections(res, ProductModel, docs, condition.products)];
                            case 1:
                                _a.sent();
                                _a.label = 2;
                            case 2:
                                if (!condition.categories) return [3, 4];
                                return [4, updatePromotionInCollections(res, ProductModel, docs, condition.categories)];
                            case 3:
                                _a.sent();
                                _a.label = 4;
                            case 4:
                                if (!(condition.type === 'all')) return [3, 6];
                                return [4, ProductModel.updateMany({
                                        $addToSet: {
                                            promotions: docs._id,
                                        },
                                    }, {
                                        new: true,
                                        runValidators: true,
                                        context: 'query',
                                    })];
                            case 5:
                                _a.sent();
                                _a.label = 6;
                            case 6:
                                cache.del("/api/promotions");
                                cache.del("/api/promotions/".concat(req.params.id));
                                return [2, res.send(docs)];
                        }
                    });
                }); })
                    .catch(function (err) {
                    var errors = promotionsErrors(err);
                    return res.status(400).send({ errors: errors });
                })];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3: return [2];
        }
    });
}); };
export var deletePromotion = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_5, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ObjectID.isValid(req.params.id)) {
                    return [2, res.status(400).send('Unknown ID : ' + req.params.id)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4, PromotionModel
                        .findByIdAndDelete({ _id: req.params.id })
                        .exec()];
            case 2:
                response = _a.sent();
                if (!response) return [3, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 6, , 7]);
                return [4, ProductModel.updateMany({
                        "promotions": {
                            $exists: true,
                            $eq: response._id
                        },
                        "$pull": {
                            promotions: response._id,
                        },
                    }, {
                        new: true,
                        runValidators: true,
                    })];
            case 4:
                _a.sent();
                return [4, CategoryModel.updateMany({
                        "promotions": {
                            $exists: true,
                            $eq: response._id
                        },
                        "$pull": {
                            promotions: response._id,
                        },
                    }, {
                        new: true,
                        runValidators: true,
                    })];
            case 5:
                _a.sent();
                return [3, 7];
            case 6:
                err_5 = _a.sent();
                console.log(err_5);
                return [2, res.status(400).send({ message: err_5 })];
            case 7:
                res.status(200).json(response);
                return [3, 9];
            case 8:
                err_6 = _a.sent();
                return [2, res.status(400).send({ message: err_6 })];
            case 9: return [2];
        }
    });
}); };
