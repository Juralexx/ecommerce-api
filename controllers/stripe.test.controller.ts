import Stripe from 'stripe';
import express from 'express';
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import CartModel from '../models/cart.model.js';
import { sendOrderConfirmEmail, sendPaymentConfirmEmail } from '../email/email.controller.js';
import mongoose from 'mongoose';

//Create a new Stripe instance
const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY, {
    apiVersion: '2022-11-15',
});

//Payment express router
const paymentRoutes = express.Router();

/**
 * Route that launch the stripe payment interface
 */

paymentRoutes.post('/create-checkout-session', async (req, res) => {
    //Retrieve cart and user from req.body
    const { user, checkout } = req.body;
    const { cart, cartId, codePromo, carrier, billing_address, delivery_address } = checkout;

    //Variable the will contain the customer created in the stripe database
    let customer;

    //Check if the user is already a customer and exists in the stripe database
    const isCustomer = await stripe.customers.search({
        query: `metadata["userId"]:"${user._id}"`,
    });

    //If customer do not exists
    if (isCustomer.data.length === 0) {
        //Assign the new customer created by stripe to the 'customer' variable
        customer = await stripe.customers.create({
            "email": user.email,
            "metadata": {
                "userId": user._id,
            },
            "name": `${user?.name} ${user?.lastname}`,
            "phone": user?.phone
        });
    }
    //Else assign the stripe customer to the 'customer' variable
    else {
        customer = isCustomer.data[0];
    }

    //Create the products array passed to stripe to retrieve them in the payment instance
    const line_items = cart.map((item: any) => {
        return {
            "price_data": {
                "currency": 'eur',
                "product_data": {
                    "name": item.name,
                    "images": [encodeURI(`${process.env.SERVER_URL}${item.image}`)],
                    "description": `Pot : ${item.variant.size}L - Hauteur : ${item.variant.height}cm`,
                    "metadata": {
                        id: item._id
                    }
                },
                "unit_amount": Math.round(item.price * 100)
            },
            "quantity": item.quantity
        }
    });

    const { _id, name, description, price, delivery_estimate } = carrier;

    //Create the session passed to the stripe payment instance
    const session = await stripe.checkout.sessions.create({
        "mode": 'payment',
        "payment_method_types": ['card'],
        "shipping_options": [
            {
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
            }
        ],
        "customer": customer.id,
        "line_items": line_items,
        "metadata": {
            orderId: new mongoose.Types.ObjectId().toString(),
            cartId: cartId,
            code_promo: JSON.stringify(codePromo),
            carrier: JSON.stringify(carrier),
            billing_address: JSON.stringify(billing_address),
            delivery_address: JSON.stringify(delivery_address),
        },
        "success_url": `${process.env.SITE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
        "cancel_url": `${process.env.SITE_URL}/order/fail?session_id={CHECKOUT_SESSION_ID}`
    });

    res.send({ url: session.url });
})

/**
 * Retrieve session and customer informations on successful payment
 */

paymentRoutes.get('/order/success', async (req, res) => {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    const customer = await stripe.customers.retrieve(session.customer as string);

    res.status(200).send({ session, customer });
});

//Stripe webhook

//Stripe webhook endpoint
const endpointSecret = "whsec_d87f089cc5a6925673f007a197cdea03fbdede3f3bc5df4abafe0d138cc2bc38";

/**
 * Stripe webhook function
 */

paymentRoutes.post('/webhook', express.raw({ type: '*/*' }), async (req: any, res) => {
    //Stripe signature passed to the constructEvent function
    const signature = req.headers['stripe-signature'];

    //Variable that will contain the stripe datas such as : payment_status, payment_method_types, shipping_details...
    let stripe_response_datas: any;

    //Stripe event name
    let eventType;

    //Check if endpointSecret contains a value
    //This to be sure to have the stripe datas and event type
    if (endpointSecret) {
        //Variable that will contain the stripe event
        let event;
        try {
            //Pass the stripe event to the 'event' variable
            event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
        } catch (err) {
            //Return error if there's one
            return res.status(400).send(`Webhook Error: ${err}`);
        }

        //Pass the stripe datas from the stripe event to the 'data' variable
        stripe_response_datas = event.data.object;
        //Pass the stripe event name from the stripe event to the 'eventType' variable
        eventType = event.type;
    } else {
        //Pass the stripe datas from the request body to the 'data' variable
        stripe_response_datas = req.body.data.object;
        //Pass the stripe event name from the request body to the 'eventType' variable
        eventType = req.body.type;
    }

    const { orderId, cartId, code_promo, carrier, billing_address, delivery_address } = stripe_response_datas.metadata;

    let cart: any;

    await CartModel
        .find({ _id: cartId })
        .populate({
            path: 'products.product',
            select: '_id name category images promotions variants',
            populate: [{
                path: 'images',
                select: '_id name path',
            }, {
                path: 'category',
                select: '_id name parent link',
            }, {
                path: 'promotions',
            }]
        })
        .then(docs => {
            //Create the products objects passed to the order stored in the database
            return cart = docs[0]?.products?.map((cartItem: any) => {
                //Get current product and quantity
                const { product, quantity } = cartItem;
                //Find the variant stored in the database through all the product variant
                const variant = product?.variants.find((el: any) => el._id.toHexString() === cartItem.variant.toHexString());
                //If the variant still exists
                if (variant) {
                    return {
                        name: product.name,
                        product: product._id,
                        variant: variant,
                        original_price: variant.price,
                        promotion: variant.promotion,
                        price: variant.price - ((variant.promotion / 100) * variant.price),
                        taxe: variant.taxe,
                        quantity: quantity
                    }
                }
            })
        })
        .catch(err => console.log(err))

    //If the stripe event type is a valid payment
    if ((cart && cart?.length > 0) && eventType === "checkout.session.completed") {
        stripe.customers
            //Return the current customer from the stripe database
            .retrieve(stripe_response_datas.customer)
            .then(async (customer: any) => {
                //Assign current date to the date prop
                const date = new Date();
                //Retrieve the payment_method from the stripe event
                const payment_method = stripe_response_datas.payment_method_types[0];
                //Get the current customer ID
                const customerId = customer.metadata.userId;
                //Get order shipping fees
                const shipping_fees = JSON.parse(carrier).price;
                //Get price from stripe datas
                const price = (stripe_response_datas.amount_total / 100);
                //Get order payment status
                const payment_status = stripe_response_datas.payment_status;
                //Get order status based on the payment status
                const status = getStatusBasedOnPayment(payment_status);
                //Assign default order timeline value
                const timeline: any[] = [];

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

                //Pass all values to the order
                const order = {
                    _id: orderId,
                    customer: customerId,
                    date,
                    payment_method,
                    payment_status,
                    delivery_address: JSON.parse(delivery_address),
                    billing_address: JSON.parse(billing_address),
                    products: cart,
                    price,
                    carrier: JSON.parse(carrier),
                    shipping_fees,
                    status,
                    timeline
                };

                //Create order database document
                await OrderModel
                    .create({ ...order })
                    .then(async (docs) => {
                        await CustomerModel.findByIdAndUpdate({
                            _id: customerId
                        }, {
                            $addToSet: {
                                orders: docs._id
                            }
                        }, {
                            new: true,
                            runValidators: true,
                            context: 'query',
                        });

                        //Send order accepted email to the customer
                        sendOrderConfirmEmail({
                            ...order,
                            _id: docs._id,
                            products: cart,
                            customer: customer,
                            total: price,
                            shipping_fees: shipping_fees
                        })
                        //Send payment confirm email to the customer
                        sendPaymentConfirmEmail({
                            ...order,
                            _id: docs._id,
                            products: cart,
                            customer: customer,
                            total: price,
                            shipping_fees: shipping_fees
                        });
                    });

                //Delete the order cart from the 'cart' database collection
                await CartModel
                    .findByIdAndDelete({ _id: cartId })
                    .exec()
            })
            .catch(err => {
                console.log(err);
                return res.status(400).send({ message: err });
            })
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
});

export default paymentRoutes;

/**
 * Return the order status based on the payment_status
 */

function getStatusBasedOnPayment(payment_status: string) {
    switch (payment_status) {
        case 'awaiting':
            return 'awaiting'
        case 'paid':
            return 'accepted'
        case 'canceled':
            return 'canceled'
        default:
            return 'awaiting'
    }
}