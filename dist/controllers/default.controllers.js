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
import mongoose from 'mongoose';
import { convertStringToRegexp, onlyNumbers, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';
var ObjectID = mongoose.Types.ObjectId;
export var getAll = function (req, res, model, config) { return __awaiter(void 0, void 0, void 0, function () {
    var options, published, q, regex_1, fields, response, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = __assign({ query: {}, select: null, limit: null, p: null, populate: null, sort: { createAt: 'asc' } }, config);
                if (req.query) {
                    if (req.query.limit) {
                        options.limit = Number(sanitize(String(req.query.limit)));
                    }
                    if (req.query.sort) {
                        options.sort = sanitize(String(req.query.sort));
                    }
                    if (req.query.select) {
                        options.select = sanitize(String(req.query.select));
                    }
                    if (req.query.populate) {
                        if (req.query.populate !== 'false') {
                            options.populate = sanitize(String(req.query.populate));
                        }
                        else {
                            options.populate = '';
                        }
                    }
                    if (req.query.p && onlyNumbers(req.query.p)) {
                        options.p = Number(req.query.p);
                    }
                    if (req.query.published) {
                        published = req.query.published.toString();
                        if (published === 'true' || published === 'false') {
                            options.query = __assign(__assign({}, options.query), { "published": published || true });
                        }
                    }
                    if (req.query.q && req.query.fields) {
                        q = sanitize(String(req.query.q));
                        regex_1 = convertStringToRegexp(q);
                        fields = req.query.fields.toString().split(',');
                        if (typeof options.query === 'undefined') {
                            options.query = {};
                        }
                        if (fields.length > 1) {
                            options.query['$or'] = [];
                            fields.forEach(function (field) {
                                var _a;
                                options.query = __assign(__assign({}, options.query), { "$or": __spreadArray(__spreadArray([], options.query.$or, true), [
                                        (_a = {}, _a[field] = { "$regex": regex_1 }, _a),
                                    ], false) });
                            });
                        }
                        else {
                            options.query = __assign(__assign({}, options.query), (_a = {}, _a[fields[0]] = { "$regex": regex_1 }, _a));
                        }
                    }
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4, model
                        .find(options.query)
                        .limit(options.limit)
                        .select(options.select)
                        .skip((options.p - 1) * options.limit)
                        .populate(options.populate)
                        .sort(options.sort)
                        .exec()];
            case 2:
                response = _b.sent();
                if (response) {
                    res.status(200).send(response);
                }
                return [3, 4];
            case 3:
                err_1 = _b.sent();
                return [2, res.status(400).send({ message: err_1 })];
            case 4: return [2];
        }
    });
}); };
export var getOne = function (req, res, model, config) { return __awaiter(void 0, void 0, void 0, function () {
    var options, response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ObjectID.isValid(req.params.id)) {
                    return [2, res.status(400).send('Unknown ID : ' + req.params.id)];
                }
                options = __assign({ populate: null, select: null }, config);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, model
                        .findById(req.params.id)
                        .populate(options.populate)
                        .select(options.select)
                        .exec()];
            case 2:
                response = _a.sent();
                if (response) {
                    cache.set(req.originalUrl, JSON.stringify(response));
                    res.status(200).send(response);
                }
                return [3, 4];
            case 3:
                err_2 = _a.sent();
                return [2, res.status(400).send({ message: err_2 })];
            case 4: return [2];
        }
    });
}); };
export var deleteOne = function (req, res, model) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ObjectID.isValid(req.params.id)) {
                    return [2, res.status(400).send('Unknown ID : ' + req.params.id)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, model
                        .findByIdAndDelete({ _id: req.params.id })
                        .exec()];
            case 2:
                response = _a.sent();
                res.status(200).json(response);
                return [3, 4];
            case 3:
                err_3 = _a.sent();
                return [2, res.status(400).send({ message: err_3 })];
            case 4: return [2];
        }
    });
}); };
