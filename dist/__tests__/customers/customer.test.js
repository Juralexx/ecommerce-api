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
import supertest from "supertest";
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
var root = process.env.SERVER_URL_TEST;
describe('Authentication', function () {
    describe('Login', function () {
        it('Should fail login attempt', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customer, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer = {
                            email: 'email@email.com',
                            password: '123456'
                        };
                        return [4, supertest(root)
                                .post('/api/customers/login')
                                .set('Authorization', process.env.API_KEY)
                                .send(__assign({}, customer))];
                    case 1:
                        statusCode = (_a.sent()).statusCode;
                        expect(statusCode).toBe(400);
                        return [2];
                }
            });
        }); });
        it('Should succeed login attempt', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer = {
                            email: 'Dean17@yahoo.com',
                            password: '09081995*'
                        };
                        return [4, supertest(root)
                                .post('/api/customers/login')
                                .set('Authorization', process.env.API_KEY)
                                .send(__assign({}, customer))
                                .then(function (res) {
                                var body = res.body, statusCode = res.statusCode;
                                expect(statusCode).toBe(200);
                                expect(body).toHaveProperty('user');
                            })
                                .catch(function (err) { return console.log(err); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
    describe('Register', function () {
        var CustomerID = new String();
        it('Should fail registration attempt', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customer, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer = {
                            email: 'email@email.com',
                            password: '123456'
                        };
                        return [4, supertest(root)
                                .post('/api/customers/register')
                                .set('Authorization', process.env.API_KEY)
                                .send(__assign({}, customer))];
                    case 1:
                        statusCode = (_a.sent()).statusCode;
                        expect(statusCode).toBe(400);
                        return [2];
                }
            });
        }); });
        it('Should succeed registration attempt', function () { return __awaiter(void 0, void 0, void 0, function () {
            var customer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        customer = {
                            email: 'john.doe@gmail.com',
                            password: 'Password1234*',
                            name: 'John',
                            lastname: 'Doe',
                            title: 'M'
                        };
                        return [4, supertest(root)
                                .post('/api/customers/register')
                                .set('Authorization', process.env.API_KEY)
                                .send(__assign({}, customer))
                                .then(function (res) {
                                var body = res.body, statusCode = res.statusCode;
                                expect(statusCode).toBe(200);
                                expect(body).toHaveProperty('_id');
                                CustomerID = body._id;
                            })
                                .catch(function (err) { return console.log(err); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('Should update customer', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, supertest(root)
                            .put("/api/customers/".concat(CustomerID, "/update"))
                            .set('Authorization', process.env.API_KEY)
                            .send({ name: 'Foo' })
                            .then(function (res) {
                            var body = res.body, statusCode = res.statusCode;
                            expect(statusCode).toBe(200);
                            expect(body.name).toBe('Foo');
                        })
                            .catch(function (err) { return console.log(err); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        it('Should delete customer', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, supertest(root)
                            .delete("/api/customers/".concat(CustomerID, "/delete"))
                            .set('Authorization', process.env.API_KEY)
                            .then(function (res) {
                            var body = res.body, statusCode = res.statusCode;
                            expect(statusCode).toBe(200);
                            expect(body._id).toBe(CustomerID);
                        })
                            .catch(function (err) { return console.log(err); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
    describe('Get all customers', function () {
        it('Should return all customers', function () { return __awaiter(void 0, void 0, void 0, function () {
            var _a, body, statusCode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, supertest(root)
                            .get('/api/customers')
                            .set('Authorization', process.env.API_KEY)];
                    case 1:
                        _a = _b.sent(), body = _a.body, statusCode = _a.statusCode;
                        expect(statusCode).toBe(200);
                        expect(Array.isArray(body.documents)).toBe(true);
                        return [2];
                }
            });
        }); });
    });
    describe('Get customer', function () {
        describe('Customer does not exist', function () {
            it('Should return error', function () { return __awaiter(void 0, void 0, void 0, function () {
                var id, statusCode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            id = '1';
                            return [4, supertest(root)
                                    .get("/api/customers/".concat(id))
                                    .set('Authorization', process.env.API_KEY)];
                        case 1:
                            statusCode = (_a.sent()).statusCode;
                            expect(statusCode).toBe(400);
                            return [2];
                    }
                });
            }); });
        });
        describe('Customer does exist', function () {
            it('Should return customer', function () { return __awaiter(void 0, void 0, void 0, function () {
                var id, _a, body, statusCode;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = '6454592501957119fef0b469';
                            return [4, supertest(root)
                                    .get("/api/customers/".concat(id))
                                    .set('Authorization', process.env.API_KEY)];
                        case 1:
                            _a = _b.sent(), body = _a.body, statusCode = _a.statusCode;
                            expect(statusCode).toBe(200);
                            expect(body._id).toBe(id);
                            return [2];
                    }
                });
            }); });
        });
    });
});
