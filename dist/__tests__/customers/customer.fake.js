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
import { generateStrongPassword } from '../../utils/utils.js';
import CustomerModel from '../../models/customer.model.js';
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function createRandomCustomer() {
    var _id = new mongoose.Types.ObjectId();
    var sex = faker.name.sexType();
    var name = faker.name.firstName(sex);
    var lastname = faker.name.lastName();
    var email = faker.helpers.unique(faker.internet.email, [
        name,
        lastname,
    ]);
    var password = generateStrongPassword(20);
    var title = faker.helpers.arrayElement(['M', 'Mme']);
    var birth = faker.date.birthdate();
    var phone = faker.phone.number('06 ## ## ## ##');
    var addresses = __spreadArray([], new Array(randomIntFromInterval(1, 5)), true).map(function () {
        return ({
            name: name,
            lastname: lastname,
            society: '',
            street: faker.address.streetAddress(),
            complement: faker.address.streetAddress(),
            postcode: faker.address.zipCode('#####'),
            city: faker.address.city(),
            phone: phone
        });
    });
    var cart = [];
    var orders = [];
    var registration_date = faker.date.past();
    return {
        _id: _id,
        name: name,
        lastname: lastname,
        email: email,
        password: password,
        title: title,
        birth: birth,
        addresses: addresses,
        phone: phone,
        cart: cart,
        orders: orders,
        registration_date: registration_date
    };
}
export function createRandomCustomers(length) {
    return __awaiter(this, void 0, void 0, function () {
        var response, i, customer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    response = [];
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < length)) return [3, 5];
                    return [4, createRandomCustomer()];
                case 2:
                    customer = _a.sent();
                    return [4, CustomerModel.create(__assign({}, customer))
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
