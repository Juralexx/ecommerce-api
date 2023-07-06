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
var ObjectID = mongoose.Types.ObjectId;
import PageModel from "../models/page.model.js";
import { pageErrors } from '../errors/pages.errors.js';
import { convertStringToRegexp, convertStringToURL, onlyNumbers, randomNbID, sanitize } from '../utils/utils.js';
import { cache } from '../app.js';
export var getPages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queries, options, isArray, direction, query, q, regex_1, fields, category, published, startDate, endDate, startDate, endDate, response_1, categories_1, sortedPages_1, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                queries = {};
                options = {
                    p: 1,
                    sort: 'category'
                };
                if (req.query) {
                    if (req.query.limit) {
                        options.limit = Number(sanitize(String(req.query.limit)));
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
                            options.query = __assign(__assign({}, options.query), (_b = {}, _b[fields[0]] = { "$regex": regex_1 }, _b));
                        }
                    }
                    if (req.query.category) {
                        category = sanitize(String(req.query.category));
                        options.query = __assign(__assign({}, options.query), { "$or": [
                                { "category.name": category },
                                { "category.url": category }
                            ] });
                    }
                    if (req.query.published) {
                        published = req.query.published.toString();
                        if (published === 'true' || published === 'false') {
                            options.published = published;
                            options.query = __assign(__assign({}, options.query), { "published": published });
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
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4, PageModel
                        .find(options.query)
                        .sort(options.sort)
                        .skip((options.p - 1) * options.limit)
                        .limit(options.limit)
                        .select(options.select)
                        .populate(options.populate)
                        .populate('image')
                        .exec()];
            case 2:
                response_1 = _c.sent();
                if (response_1) {
                    if (req.query.sorted && req.query.sorted === 'true') {
                        categories_1 = [];
                        response_1.forEach(function (page) {
                            if (!categories_1.some(function (category) { return category.name === page.category.name; })) {
                                categories_1 = __spreadArray(__spreadArray([], categories_1, true), [page.category], false);
                            }
                        });
                        if (req.query.only_categories && req.query.only_categories === 'true') {
                            cache.set(req.originalUrl, JSON.stringify(categories_1));
                            res.status(200).send(categories_1);
                        }
                        else {
                            sortedPages_1 = [];
                            categories_1.forEach(function (category) {
                                var pages = response_1.filter(function (page) { return page.category.name === category.name; });
                                sortedPages_1 = __spreadArray(__spreadArray([], sortedPages_1, true), [{
                                        category: category,
                                        pages: pages
                                    }], false);
                            });
                            cache.set(req.originalUrl, JSON.stringify(sortedPages_1));
                            res.status(200).send(sortedPages_1);
                        }
                    }
                    else {
                        cache.set(req.originalUrl, JSON.stringify(response_1));
                        res.status(200).send(response_1);
                    }
                }
                return [3, 4];
            case 3:
                err_1 = _c.sent();
                return [2, res.status(400).send({ message: err_1 })];
            case 4: return [2];
        }
    });
}); };
export var getPageByUrl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.params.url) {
                    return [2, res.status(400).send('Unknown URL : ' + req.params.id)];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, PageModel
                        .findOne({
                        "link": req.params.url
                    })
                        .populate('image')
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
export var createPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, category, link, content, image, published, url;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, category = _a.category, link = _a.link, content = _a.content, image = _a.image, published = _a.published;
                if (!link || link.length === 0) {
                    url = convertStringToURL(title);
                    link = "".concat(url, "-").concat(randomNbID(8));
                }
                if (category) {
                    category.url = convertStringToURL(category);
                }
                return [4, PageModel.create({
                        title: title,
                        link: link,
                        category: category,
                        content: content,
                        published: published,
                        image: image._id
                    })
                        .then(function (docs) {
                        return res.send(docs);
                    })
                        .catch(function (err) {
                        var errors = pageErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 1:
                _b.sent();
                return [2];
        }
    });
}); };
export var updatePage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, category, link, content, image, published, url;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, title = _a.title, category = _a.category, link = _a.link, content = _a.content, image = _a.image, published = _a.published;
                if (title && (link && link.length === 0)) {
                    url = convertStringToURL(title);
                    link = "".concat(url, "-").concat(randomNbID(8));
                }
                if (category.name) {
                    category.url = convertStringToURL(category.name);
                }
                if (!req.params.id) return [3, 3];
                if (!!ObjectID.isValid(req.params.id)) return [3, 1];
                return [2, res.status(400).send("ID unknown : " + req.params.id)];
            case 1: return [4, PageModel.findByIdAndUpdate({
                    _id: req.params.id
                }, {
                    $set: {
                        title: title,
                        link: link,
                        category: category,
                        content: content,
                        published: published,
                        image: image === null || image === void 0 ? void 0 : image._id
                    },
                }, {
                    new: true,
                    runValidators: true,
                    context: 'query',
                })
                    .then(function (docs) {
                    cache.del("/api/pages");
                    cache.del("/api/pages/".concat(req.params.id));
                    return res.send(docs);
                })
                    .catch(function (err) {
                    var errors = pageErrors(err);
                    return res.status(400).send({ errors: errors });
                })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2];
        }
    });
}); };
