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
import OrderModel from '../models/order.model.js';
import CategoryModel from '../models/category.model.js';
import ProductModel from '../models/product.model.js';
import CustomerModel from '../models/customer.model.js';
function calculateStaticsByPeriod(req, getStatistics) {
    return __awaiter(this, void 0, void 0, function () {
        var currentDate, sevenDaysAgo, oneMonthAgo, sixMonthAgo, oneYearAgo, fiveYearsAgo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentDate = new Date();
                    if (!(req.params.from === '7j')) return [3, 2];
                    sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
                    return [4, getStatistics(sevenDaysAgo, 7)];
                case 1:
                    _a.sent();
                    return [3, 10];
                case 2:
                    if (!(req.params.from === '1m')) return [3, 4];
                    oneMonthAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
                    return [4, getStatistics(oneMonthAgo, 30)];
                case 3:
                    _a.sent();
                    return [3, 10];
                case 4:
                    if (!(req.params.from === '6m')) return [3, 6];
                    sixMonthAgo = new Date(currentDate.setDate(currentDate.getDate() - 182));
                    return [4, getStatistics(sixMonthAgo, 182)];
                case 5:
                    _a.sent();
                    return [3, 10];
                case 6:
                    if (!(req.params.from === '1a')) return [3, 8];
                    oneYearAgo = new Date(currentDate.setDate(currentDate.getDate() - 365));
                    return [4, getStatistics(oneYearAgo, 365)];
                case 7:
                    _a.sent();
                    return [3, 10];
                case 8:
                    if (!(req.params.from === '5a')) return [3, 10];
                    fiveYearsAgo = new Date(currentDate.setDate(currentDate.getDate() - 1825));
                    return [4, getStatistics(fiveYearsAgo, 1825)];
                case 9:
                    _a.sent();
                    _a.label = 10;
                case 10: return [2];
            }
        });
    });
}
;
function getTotalOrdersAmount(orders) {
    var paidOrders = orders.filter(function (order) { return order.payment_status === 'paid'; });
    var total = 0;
    for (var i = 0; i < paidOrders.length; i++) {
        total = total + paidOrders[i].price;
    }
    ;
    return total.toFixed(2);
}
;
function getTotalOrdersCompleted(orders) {
    var completedOrders = orders.filter(function (order) { return order.status === 'completed' || order.status === 'shipped' || order.status === 'delivered'; });
    return completedOrders.length;
}
;
function getOrdersAveragePrice(orders) {
    var paidOrders = orders.filter(function (order) { return order.payment_status === 'paid'; });
    var total = 0;
    paidOrders.forEach(function (order) {
        total += order.price;
    });
    if (total > 0) {
        return (total / paidOrders.length).toFixed(2);
    }
    else {
        return 0;
    }
}
export var getOrdersStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, getStatistics;
    return __generator(this, function (_a) {
        orders = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_1, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, OrderModel
                                .find({
                                "date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .then(function (docs) {
                                orders = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        return [2, res.status(400).send({ message: err_1 })];
                    case 3:
                        dataset = {};
                        __spreadArray([], new Array(nbOfDays), true).map(function (_, i) {
                            var date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
                            dataset[date] = orders.filter(function (order) { return new Date(order.date).toISOString().split('T')[0] === date; });
                        });
                        res.status(200).send({
                            labels: Object.keys(dataset).map(function (value) { return value; }).reverse(),
                            dataset: Object.values(dataset).map(function (value) { return value.length; }).reverse(),
                            totalOrdersAmount: getTotalOrdersAmount(orders),
                            totalOrdersCompleted: getTotalOrdersCompleted(orders),
                            ordersAveragePrice: getOrdersAveragePrice(orders),
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
function getSellsAveragePrice(daysRevenus) {
    var total = 0;
    daysRevenus.forEach(function (revenue) {
        total += revenue;
    });
    if (total > 0) {
        return (total / daysRevenus.length).toFixed(2);
    }
    else {
        return 0;
    }
}
;
export var getSellsStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, getStatistics;
    return __generator(this, function (_a) {
        orders = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_2, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, OrderModel
                                .find({
                                "date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .then(function (docs) {
                                orders = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_2 = _a.sent();
                        return [2, res.status(400).send({ message: err_2 })];
                    case 3:
                        dataset = {};
                        __spreadArray([], new Array(nbOfDays), true).map(function (_, i) {
                            var date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
                            var nbOfOrdersThisDate = orders.filter(function (order) { return new Date(order.date).toISOString().split('T')[0] === date; });
                            var dayRevenue = 0;
                            nbOfOrdersThisDate.forEach(function (order) {
                                dayRevenue += order.price;
                            });
                            dataset[date] = dayRevenue;
                        });
                        res.status(200).send({
                            labels: Object.keys(dataset).map(function (value) { return value; }).reverse(),
                            dataset: Object.values(dataset).map(function (value) { return value; }).reverse(),
                            sellsOrdersAmount: getTotalOrdersAmount(orders),
                            sellsAveragePrice: getSellsAveragePrice(Object.values(dataset).map(function (value) { return value; }).reverse()),
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
function getTotalProductsSold(orders) {
    var nbOfProductsSold = 0;
    orders.forEach(function (order) {
        order.products.forEach(function (product) {
            nbOfProductsSold += product.quantity;
        });
    });
    return nbOfProductsSold;
}
function getProductsAverageByOrder(orders) {
    var total = 0;
    orders.forEach(function (order) {
        order.products.forEach(function (product) {
            total += product.quantity;
        });
    });
    return Math.round(total / orders.length);
}
export var getProductsStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, getStatistics;
    return __generator(this, function (_a) {
        orders = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_3, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, OrderModel
                                .find({
                                "date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .then(function (docs) {
                                orders = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_3 = _a.sent();
                        return [2, res.status(400).send({ message: err_3 })];
                    case 3:
                        dataset = {};
                        __spreadArray([], new Array(nbOfDays), true).map(function (_, i) {
                            var date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
                            var nbOfOrdersThisDate = orders.filter(function (order) { return new Date(order.date).toISOString().split('T')[0] === date; });
                            var nbOfProductsSold = 0;
                            nbOfOrdersThisDate.forEach(function (order) {
                                order.products.forEach(function (product) {
                                    nbOfProductsSold += product.quantity;
                                });
                            });
                            dataset[date] = nbOfProductsSold;
                        });
                        res.status(200).send({
                            labels: Object.keys(dataset).map(function (value) { return value; }).reverse(),
                            dataset: Object.values(dataset).map(function (value) { return value; }).reverse(),
                            totalProductsSold: getTotalProductsSold(orders),
                            productsAverageByOrder: getProductsAverageByOrder(orders),
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
export var getCategoriesStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, categories, getStatistics;
    return __generator(this, function (_a) {
        orders = [];
        categories = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_4, err_5, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, CategoryModel
                                .find()
                                .then(function (docs) {
                                categories = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_4 = _a.sent();
                        return [2, res.status(400).send({ message: err_4 })];
                    case 3:
                        ;
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4, OrderModel
                                .find({
                                "date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .populate({
                                path: 'products.product',
                                select: '_id ref name category price stock promotion images',
                                populate: [
                                    {
                                        path: 'category',
                                        select: '_id name parent link',
                                    }
                                ]
                            })
                                .then(function (docs) {
                                orders = docs;
                            })];
                    case 5:
                        _a.sent();
                        return [3, 7];
                    case 6:
                        err_5 = _a.sent();
                        return [2, res.status(400).send({ message: err_5 })];
                    case 7:
                        dataset = {};
                        categories.map(function (category) {
                            return dataset[category.name] = 0;
                        });
                        orders.map(function (order) {
                            order.products.forEach(function (product) {
                                dataset[product.product.category.name] += product.quantity;
                            });
                        });
                        res.status(200).send({
                            labels: categories.map(function (category) { return category.name; }),
                            dataset: Object.values(dataset).map(function (value) { return value; }),
                            period: req.params.from
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
export var getMostSoldProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var orders, getStatistics;
    return __generator(this, function (_a) {
        orders = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_6, dataset, datas, sortProductsByQuantity, mostSoldProducts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, OrderModel
                                .find({
                                "date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .then(function (docs) {
                                orders = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_6 = _a.sent();
                        return [2, res.status(400).send({ message: err_6 })];
                    case 3:
                        ;
                        dataset = {};
                        orders.map(function (order) {
                            order.products.forEach(function (item) {
                                var id = item.product._id;
                                if (dataset[id]) {
                                    dataset[id] += item.quantity;
                                }
                                else {
                                    dataset[id] = item.quantity;
                                }
                            });
                        });
                        datas = Object.entries(dataset).map(function (_a) {
                            var key = _a[0], value = _a[1];
                            return { _id: key, quantity: value };
                        });
                        sortProductsByQuantity = datas.sort(function (x, y) { return y.quantity - x.quantity; }).slice(0, 8);
                        mostSoldProducts = [];
                        return [4, Promise.all(sortProductsByQuantity.map(function (product, i) { return __awaiter(void 0, void 0, void 0, function () {
                                var response, err_7;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4, ProductModel
                                                    .findById(product._id)
                                                    .select('-description -content')
                                                    .populate('images category promotions')
                                                    .exec()];
                                        case 1:
                                            response = _a.sent();
                                            return [2, mostSoldProducts = __spreadArray(__spreadArray([], mostSoldProducts, true), [{ product: response, quantity: sortProductsByQuantity[i].quantity }], false)];
                                        case 2:
                                            err_7 = _a.sent();
                                            return [2, res.status(400).send({ message: err_7 })];
                                        case 3: return [2];
                                    }
                                });
                            }); }))];
                    case 4:
                        _a.sent();
                        res.status(200).send({
                            mostSoldProducts: mostSoldProducts
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
export var getCustomersStatistics = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customers, getStatistics;
    return __generator(this, function (_a) {
        customers = [];
        getStatistics = function (from, nbOfDays) { return __awaiter(void 0, void 0, void 0, function () {
            var err_8, dataset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, CustomerModel
                                .find({
                                "registration_date": {
                                    $gte: new Date(from.toString()),
                                    $lte: new Date()
                                }
                            })
                                .then(function (docs) {
                                customers = docs;
                            })];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        err_8 = _a.sent();
                        return [2, res.status(400).send({ message: err_8 })];
                    case 3:
                        ;
                        dataset = {};
                        __spreadArray([], new Array(nbOfDays), true).map(function (_, i) {
                            var date = new Date(new Date().setDate(new Date().getDate() - (i + 1))).toISOString().split('T')[0];
                            dataset[date] = customers.filter(function (customer) { return new Date(customer.registration_date).toISOString().split('T')[0] === date; });
                        });
                        res.status(200).send({
                            labels: Object.keys(dataset).map(function (value) { return value; }).reverse(),
                            dataset: Object.values(dataset).map(function (value) { return value.length; }).reverse(),
                            totalCustomers: customers.length,
                            customersAverage: (customers.length / nbOfDays).toFixed(2)
                        });
                        return [2];
                }
            });
        }); };
        calculateStaticsByPeriod(req, getStatistics);
        return [2];
    });
}); };
