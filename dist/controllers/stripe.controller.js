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
import Stripe from 'stripe';
import express from 'express';
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import CartModel from '../models/cart.model.js';
import { sendOrderConfirmEmail, sendPaymentConfirmEmail } from '../email/email.controller.js';
var stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY, {
    apiVersion: '2022-11-15',
});
var paymentRoutes = express.Router();
var orderCart = [];
var cartID = null;
var shippingCarrier = null;
paymentRoutes.post('/create-checkout-session', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, cart, carrier, cartId, user, customer, isCustomer, line_items, _id, name, description, price, delivery_estimate, session;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, cart = _a.cart, carrier = _a.carrier, cartId = _a.cartId, user = _a.user;
                orderCart = __spreadArray([], cart, true);
                cartID = cartId;
                shippingCarrier = carrier;
                return [4, stripe.customers.search({
                        query: "metadata[\"userId\"]:\"".concat(user._id, "\""),
                    })];
            case 1:
                isCustomer = _b.sent();
                if (!(isCustomer.data.length === 0)) return [3, 3];
                return [4, stripe.customers.create({
                        "email": user.email,
                        "metadata": {
                            "userId": user._id,
                        },
                        "name": "".concat(user === null || user === void 0 ? void 0 : user.name, " ").concat(user === null || user === void 0 ? void 0 : user.lastname),
                        "phone": user === null || user === void 0 ? void 0 : user.phone
                    })];
            case 2:
                customer = _b.sent();
                return [3, 4];
            case 3:
                customer = isCustomer.data[0];
                _b.label = 4;
            case 4:
                line_items = cart.map(function (item) {
                    return {
                        price_data: {
                            currency: 'eur',
                            product_data: {
                                name: item.name,
                                images: ["".concat(process.env.SERVER_URL).concat(item.image)],
                                description: "Pot : ".concat(item.variant.size, "L - Hauteur : ").concat(item.variant.height, "cm"),
                                metadata: {
                                    id: item._id
                                }
                            },
                            unit_amount: Math.round(item.price * 100)
                        },
                        quantity: item.quantity
                    };
                });
                _id = carrier._id, name = carrier.name, description = carrier.description, price = carrier.price, delivery_estimate = carrier.delivery_estimate;
                return [4, stripe.checkout.sessions.create({
                        mode: 'payment',
                        payment_method_types: ['card'],
                        shipping_address_collection: {
                            allowed_countries: ['FR'],
                        },
                        billing_address_collection: 'required',
                        shipping_options: [{
                                shipping_rate_data: {
                                    type: 'fixed_amount',
                                    fixed_amount: {
                                        amount: (price * 100),
                                        currency: 'eur',
                                    },
                                    display_name: name,
                                    delivery_estimate: {
                                        minimum: {
                                            unit: 'business_day',
                                            value: delivery_estimate.minimum,
                                        },
                                        maximum: {
                                            unit: 'business_day',
                                            value: delivery_estimate.maximum,
                                        }
                                    },
                                    metadata: {
                                        _id: String(_id),
                                        name: name,
                                        description: description
                                    }
                                }
                            }],
                        customer: customer.id,
                        line_items: line_items,
                        success_url: "".concat(process.env.SITE_URL, "/order/success"),
                        cancel_url: "".concat(process.env.SITE_URL, "/order/canceled")
                    })];
            case 5:
                session = _b.sent();
                res.send({ url: session.url });
                return [2];
        }
    });
}); });
var endpointSecret = "whsec_d87f089cc5a6925673f007a197cdea03fbdede3f3bc5df4abafe0d138cc2bc38";
paymentRoutes.post('/webhook', express.raw({ type: '*/*' }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var signature, stripe_response_datas, eventType, event;
    return __generator(this, function (_a) {
        signature = req.headers['stripe-signature'];
        if (endpointSecret) {
            event = void 0;
            try {
                event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
            }
            catch (err) {
                return [2, res.status(400).send("Webhook Error: ".concat(err))];
            }
            stripe_response_datas = event.data.object;
            eventType = event.type;
        }
        else {
            stripe_response_datas = req.body.data.object;
            eventType = req.body.type;
        }
        if (eventType === "checkout.session.completed") {
            stripe.customers
                .retrieve(stripe_response_datas.customer)
                .then(function (customer) { return __awaiter(void 0, void 0, void 0, function () {
                var products, date, payment_method, delivery_address, billing_address, customerId, carrier, shipping_fees, price, payment_status, status, timeline, order;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            products = orderCart.map(function (product) {
                                return {
                                    product: product._id,
                                    variant: product.variant,
                                    original_price: product.original_price,
                                    promotion: product.promotion,
                                    price: product.price,
                                    taxe: product.taxe,
                                    quantity: product.quantity
                                };
                            });
                            date = new Date();
                            payment_method = stripe_response_datas.payment_method_types[0];
                            delivery_address = {
                                street: stripe_response_datas.shipping_details.address.line1,
                                postcode: stripe_response_datas.shipping_details.address.postal_code,
                                city: stripe_response_datas.shipping_details.address.city
                            };
                            billing_address = {
                                street: stripe_response_datas.shipping_details.address.line1,
                                postcode: stripe_response_datas.shipping_details.address.postal_code,
                                city: stripe_response_datas.shipping_details.address.city
                            };
                            customerId = customer.metadata.userId;
                            carrier = shippingCarrier;
                            shipping_fees = carrier.price;
                            price = (stripe_response_datas.amount_total * 100);
                            payment_status = stripe_response_datas.payment_status;
                            status = getStatusBasedOnPayment(payment_status);
                            timeline = [];
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
                            order = {
                                customer: customerId,
                                date: date,
                                payment_method: payment_method,
                                payment_status: payment_status,
                                delivery_address: delivery_address,
                                billing_address: billing_address,
                                products: products,
                                price: price,
                                carrier: carrier,
                                shipping_fees: shipping_fees,
                                status: status,
                                timeline: timeline
                            };
                            return [4, OrderModel
                                    .create(__assign({}, order))
                                    .then(function (docs) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, CustomerModel.findByIdAndUpdate({
                                                    _id: customerId
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
                                                sendOrderConfirmEmail(__assign(__assign({}, order), { _id: docs._id, products: orderCart, customer: customer }));
                                                sendPaymentConfirmEmail(__assign(__assign({}, order), { _id: docs._id, products: orderCart, customer: customer }));
                                                return [2];
                                        }
                                    });
                                }); })];
                        case 1:
                            _a.sent();
                            return [4, CartModel
                                    .findByIdAndDelete({ _id: cartID })
                                    .exec()];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            }); })
                .catch(function (err) {
                console.log(err);
                return res.status(400).send({ message: err });
            });
        }
        res.send().end();
        return [2];
    });
}); });
export default paymentRoutes;
function getStatusBasedOnPayment(payment_status) {
    switch (payment_status) {
        case 'awaiting':
            return 'awaiting';
        case 'paid':
            return 'accepted';
        case 'canceled':
            return 'canceled';
        default:
            return 'awaiting';
    }
}
