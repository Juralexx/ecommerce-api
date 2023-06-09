import Stripe from 'stripe';
import express from 'express';
import mongoose from 'mongoose';
import OrderModel from '../models/order.model.js';
import CustomerModel from '../models/customer.model.js';
import CartModel from '../models/cart.model.js';
import { sendOrderConfirmEmail, sendPaymentConfirmEmail } from '../email/email.controller.js';
import { ICarrier } from 'types/types.js';

//Create a new Stripe instance
const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY, {
    apiVersion: '2022-11-15',
});

//Payment express router
const paymentRoutes = express.Router();

//Variable that will contain the order cart
//We define at the root of the file so we can access it in all functions
let orderCart: any[] = [];

//Variable that will contain the current order cart ID
//After the order payment is validated we will be able thanks to this variable
//to delete the cart document from the 'cart' database collection
let cartID: mongoose.Types.ObjectId = null;

//Variable that will contain the choosen delivery carrier
//We define a variable because Stripe do not return the full carrier object, just the shipping fees total
let shippingCarrier: ICarrier = null;

/**
 * Route that launch the stripe payment interface
 */

paymentRoutes.post('/create-checkout-session', async (req, res) => {
    //Retrieve cart and user from req.body
    const { cart, carrier, cartId, user } = req.body;

    //Variable the will contain the customer created in the stripe database
    let customer;
    //Assign the cart to the 'orderCart' variable
    orderCart = [...cart];
    //Assign the cart ID the 'cartID' variable
    cartID = cartId;
    //Assign the carrier to the 'shippingCarrier' variable
    shippingCarrier = carrier;

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
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    images: [`${process.env.SERVER_URL}${item.image}`],
                    description: `Pot : ${item.variant.size}L - Hauteur : ${item.variant.height}cm`,
                    metadata: {
                        id: item._id
                    }
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }
    });

    //Retrieve the carrier properties
    const { _id, name, description, price, delivery_estimate } = carrier;

    //Create the session passed to the stripe payment instance
    const session = await stripe.checkout.sessions.create({
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
        success_url: `${process.env.SITE_URL}/order/success`,
        cancel_url: `${process.env.SITE_URL}/order/canceled`
    });

    res.send({ url: session.url });
})

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

    //If the stripe event type is a valid payment
    if (eventType === "checkout.session.completed") {
        stripe.customers
            //Return the current customer from the stripe database
            .retrieve(stripe_response_datas.customer)
            .then(async (customer: any) => {
                //Create the products objects passed to the order stored in the database
                const products = orderCart.map((product: any) => {
                    return {
                        product: product._id,
                        variant: product.variant,
                        original_price: product.original_price,
                        promotion: product.promotion,
                        price: product.price,
                        taxe: product.taxe,
                        quantity: product.quantity
                    }
                });
                //Assign current date to the date prop
                const date = new Date();
                //Retrieve the payment_method from the stripe event
                const payment_method = stripe_response_datas.payment_method_types[0];
                //Delivery address object
                const delivery_address = {
                    street: stripe_response_datas.shipping_details.address.line1,
                    postcode: stripe_response_datas.shipping_details.address.postal_code,
                    city: stripe_response_datas.shipping_details.address.city
                };
                //Billing address object
                const billing_address = {
                    street: stripe_response_datas.shipping_details.address.line1,
                    postcode: stripe_response_datas.shipping_details.address.postal_code,
                    city: stripe_response_datas.shipping_details.address.city
                };
                //Get the current customer ID
                const customerId = customer.metadata.userId;
                //Get order carrier
                const carrier = shippingCarrier;
                //Get order shipping fees
                const shipping_fees = carrier.price;
                //Get price from stripe datas
                const price = (stripe_response_datas.amount_total * 100);
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
                            products: orderCart,
                            customer: customer
                        })
                        //Send payment confirm email to the customer
                        sendPaymentConfirmEmail({
                            ...order,
                            _id: docs._id,
                            products: orderCart,
                            customer: customer
                        });
                    });

                //Delete the order cart from the 'cart' database collection
                await CartModel
                    .findByIdAndDelete({ _id: cartID })
                    .exec()
            })
            .catch(err => {
                console.log(err)
                return res.status(400).send({ message: err });
            })
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
});

export default paymentRoutes

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