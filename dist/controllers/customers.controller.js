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
import bcrypt from 'bcryptjs';
import CustomerModel from '../models/customer.model.js';
import { customerErrors } from '../errors/customers.errors.js';
import { convertStringToRegexp, isPasswordStrong, isPhoneValid, isValidPostcode, onlyNumbers, sanitize } from '../utils/utils.js';
import { customerRegisterErrors } from '../errors/sign.errors.js';
import { cache } from '../app.js';
export var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, birth, name, lastname, email, password, addresses, phone, cart, orders, i, _b, name_1, lastname_1, street, city, postcode, phone_1;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = req.body, title = _a.title, birth = _a.birth, name = _a.name, lastname = _a.lastname, email = _a.email, password = _a.password, addresses = _a.addresses, phone = _a.phone, cart = _a.cart, orders = _a.orders;
                if (addresses && addresses.length > 0) {
                    for (i = 0; i < addresses.length; i++) {
                        _b = addresses[i], name_1 = _b.name, lastname_1 = _b.lastname, street = _b.street, city = _b.city, postcode = _b.postcode, phone_1 = _b.phone;
                        if (name_1.length === 0) {
                            return [2, res.status(400).send({ errors: (_c = {}, _c["name-".concat(i)] = 'Veuillez saisir un prénom valide.', _c) })];
                        }
                        if (lastname_1.length === 0) {
                            return [2, res.status(400).send({ errors: (_d = {}, _d["lastname-".concat(i)] = 'Veuillez saisir un nom valide.', _d) })];
                        }
                        if (street.length === 0) {
                            return [2, res.status(400).send({ errors: (_e = {}, _e["street-".concat(i)] = 'Veuillez saisir une rue valide.', _e) })];
                        }
                        if (city.length === 0) {
                            return [2, res.status(400).send({ errors: (_f = {}, _f["city-".concat(i)] = 'Veuillez saisir une ville valide.', _f) })];
                        }
                        if (!isValidPostcode(postcode)) {
                            return [2, res.status(400).send({ errors: (_g = {}, _g["postcode-".concat(i)] = 'Veuillez saisir un code postal valide.', _g) })];
                        }
                        if (phone_1.length === 0 || !isPhoneValid(phone_1)) {
                            return [2, res.status(400).send({ errors: (_h = {}, _h["phone-".concat(i)] = 'Veuillez saisir un départment valide.', _h) })];
                        }
                    }
                    ;
                }
                ;
                return [4, CustomerModel.create({
                        title: title,
                        name: name,
                        lastname: lastname,
                        email: email,
                        password: password,
                        birth: birth,
                        addresses: addresses,
                        phone: phone,
                        cart: cart,
                        orders: orders,
                        registration_date: new Date()
                    })
                        .then(function (docs) {
                        return res.send(docs);
                    })
                        .catch(function (err) {
                        console.log(err);
                        var errors = customerRegisterErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 1:
                _j.sent();
                return [2];
        }
    });
}); };
export var getCustomers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var options, isArray, direction, query, q, regex, count, err_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = {
                    p: 1,
                    limit: 24,
                    select: '-password'
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
                        q = sanitize(String(req.query.q));
                        regex = convertStringToRegexp(q);
                        options.query = __assign(__assign({}, options.query), { "$or": [
                                { "name": { "$regex": regex } },
                                { "lastname": { "$regex": regex } },
                                { "email": { "$regex": regex } },
                            ] });
                    }
                    ;
                }
                ;
                return [4, CustomerModel.countDocuments(options.query)];
            case 1:
                count = _b.sent();
                if (options.p) {
                    if (options.p > Math.ceil(count / options.limit)) {
                        options.p = Math.ceil(count / options.limit);
                    }
                    if (options.p < 1) {
                        options.p = 1;
                    }
                }
                ;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4, CustomerModel
                        .find(options.query)
                        .limit(options.limit)
                        .skip((options.p - 1) * options.limit)
                        .populate(options.select && options.select.includes('-orders') ? undefined : { path: 'orders' })
                        .populate(options.populate)
                        .select(options.select)
                        .select('-password')
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
                _b.sent();
                return [3, 5];
            case 4:
                err_1 = _b.sent();
                return [2, res.status(400).send({ message: err_1 })];
            case 5:
                ;
                return [2];
        }
    });
}); };
export var updateCustomer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, birth, name, lastname, email, password, confirmPassword, newPassword, addresses, phone, cart, orders, user, isSamePassword, salt, hash, i, _b, name_2, lastname_2, street, city, postcode, phone_2;
    var _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                _a = req.body, title = _a.title, birth = _a.birth, name = _a.name, lastname = _a.lastname, email = _a.email, password = _a.password, confirmPassword = _a.confirmPassword, newPassword = _a.newPassword, addresses = _a.addresses, phone = _a.phone, cart = _a.cart, orders = _a.orders;
                if (!req.params.id) return [3, 13];
                if (!!ObjectID.isValid(req.params.id)) return [3, 1];
                return [2, res.status(400).send("ID unknown : " + req.params.id)];
            case 1:
                if (!(password && newPassword)) return [3, 10];
                if (!isPasswordStrong(newPassword)) {
                    return [2, res.status(400).send({ errors: { newPassword: "Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins : ".concat('- Une majuscule', " ").concat('- Une minuscule', " ").concat('- Un chiffre', " ").concat('- Un charactère spécial', " ").concat('- Contenir 8 caractères') } })];
                }
                if (password !== confirmPassword) {
                    return [2, res.status(400).send({ errors: { confirmPassword: 'Les mots de passe ne correspondent pas.' } })];
                }
                return [4, CustomerModel.findById(req.params.id)];
            case 2:
                user = _j.sent();
                if (!user) return [3, 9];
                return [4, bcrypt.compare(password, user.password)];
            case 3:
                isSamePassword = _j.sent();
                if (!isSamePassword) return [3, 7];
                return [4, bcrypt.genSalt()];
            case 4:
                salt = _j.sent();
                return [4, bcrypt.hash(newPassword, salt)];
            case 5:
                hash = _j.sent();
                return [4, CustomerModel.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $set: {
                            password: hash
                        },
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })];
            case 6:
                _j.sent();
                return [3, 8];
            case 7: return [2, res.status(400).send({ errors: { password: 'Mot de passe incorrect' } })];
            case 8:
                ;
                _j.label = 9;
            case 9:
                ;
                _j.label = 10;
            case 10:
                if (addresses && addresses.length > 0) {
                    for (i = 0; i < addresses.length; i++) {
                        _b = addresses[i], name_2 = _b.name, lastname_2 = _b.lastname, street = _b.street, city = _b.city, postcode = _b.postcode, phone_2 = _b.phone;
                        if (name_2.length === 0) {
                            return [2, res.status(400).send({ errors: (_c = {}, _c["name-".concat(i)] = 'Veuillez saisir un prénom valide.', _c) })];
                        }
                        if (lastname_2.length === 0) {
                            return [2, res.status(400).send({ errors: (_d = {}, _d["lastname-".concat(i)] = 'Veuillez saisir un nom valide.', _d) })];
                        }
                        if (street.length === 0) {
                            return [2, res.status(400).send({ errors: (_e = {}, _e["street-".concat(i)] = 'Veuillez saisir une rue valide.', _e) })];
                        }
                        if (city.length === 0) {
                            return [2, res.status(400).send({ errors: (_f = {}, _f["city-".concat(i)] = 'Veuillez saisir une ville valide.', _f) })];
                        }
                        if (!isValidPostcode(postcode)) {
                            return [2, res.status(400).send({ errors: (_g = {}, _g["postcode-".concat(i)] = 'Veuillez saisir un code postal valide.', _g) })];
                        }
                        if (phone_2.length === 0 || !isPhoneValid(phone_2)) {
                            return [2, res.status(400).send({ errors: (_h = {}, _h["phone-".concat(i)] = 'Veuillez saisir un départment valide.', _h) })];
                        }
                    }
                    ;
                }
                ;
                return [4, CustomerModel.findByIdAndUpdate({
                        _id: req.params.id
                    }, {
                        $set: {
                            title: title,
                            name: name,
                            lastname: lastname,
                            email: email,
                            birth: birth,
                            addresses: addresses,
                            phone: phone,
                            cart: cart,
                        },
                        $addToSet: {
                            orders: orders
                        }
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })
                        .then(function (docs) {
                        cache.del("/api/customers");
                        cache.del("/api/customers/".concat(req.params.id));
                        return res.send(docs);
                    })
                        .catch(function (err) {
                        var errors = customerErrors(err);
                        return res.status(400).send({ errors: errors });
                    })];
            case 11:
                _j.sent();
                _j.label = 12;
            case 12:
                ;
                _j.label = 13;
            case 13:
                ;
                return [2];
        }
    });
}); };
