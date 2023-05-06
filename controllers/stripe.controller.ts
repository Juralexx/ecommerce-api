import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_API_KEY, {
    apiVersion: '2022-11-15',
});

const paymentRoutes = express.Router()

paymentRoutes.post('/create-checkout-session', async (req, res) => {
    const { cart, user } = req.body

    const line_items = cart.map((item: any) => {
        return {
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    images: [`${process.env.SERVER_URL}${item.image}`],
                    description: `${item.variant.width}/${item.variant.height}cm`,
                    metadata: {
                        id: item._id
                    }
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }
    })

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['FR'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        },
                    },
                },
            },
        ],
        line_items: line_items,
        success_url: `${process.env.FRONT_URL}/success-order`,
        cancel_url: `${process.env.FRONT_URL}/cart`
    })

    res.send({ url: session.url })
})

// Stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_d87f089cc5a6925673f007a197cdea03fbdede3f3bc5df4abafe0d138cc2bc38";

paymentRoutes.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        console.log('Webhook verified');
    } catch (err) {
        console.log(err)
        response.status(400).send(`Webhook Error: ${err}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
});

export default paymentRoutes