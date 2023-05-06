import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import OrderModel from '../../models/order.model.ts';
import ProductModel from '../../models/product.model.ts';
import CustomerModel from "../../models/customer.model.ts";
import UserModel from "../../models/user.model.ts";
import CarrierModel from "../../models/carrier.model.ts";
import { departments, regions } from '../regions.js';

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getRandomCustomer() {
    const customer = await CustomerModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: customer[0]._id,
        name: customer[0].name,
        lastname: customer[0].lastname,
        email: customer[0].email,
        phone: customer[0].phone,
        title: customer[0].title,
        addresses: customer[0].addresses
    }
}

async function getRandomProducts() {
    const products: any = await ProductModel.aggregate([{ $sample: { size: randomIntFromInterval(1, 15) } }])

    return products.map((product: any) => {
        const variant = faker.helpers.arrayElement([...product.variants])
        return {
            product: {
                _id: product._id
            },
            variant: {
                ...variant
            },
            original_price: variant.price,
            promotion: variant.promotion,
            price: (variant.price - ((variant.promotion / 100) * variant.price)).toFixed(2),
            taxe: variant.taxe,
            number: randomIntFromInterval(1, 4)
        }
    })
}

export async function getRandomCarrier() {
    const carrier = await CarrierModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: carrier[0]._id,
        price: carrier[0].price
    }
}

export async function getRandomUser() {
    const user = await UserModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: user[0]._id,
        name: user[0].name,
        lastname: user[0].lastname,
        email: user[0].email
    }
}

function getStatusBasedOnPayment(payment_status: string) {
    switch (payment_status) {
        case 'awaiting':
            return ['awaiting']
        case 'paid':
            return ['accepted', 'preparation', 'completed', 'shipped', 'delivered']
        case 'canceled':
            return ['canceled']
        default:
            return ['awaiting']
    }
}

export async function createRandomOrder() {
    const _id = new mongoose.Types.ObjectId();
    const date = faker.date.past();
    const payment_method = faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'paypal']);
    const delivery_address = {
        street: faker.datatype.number({ min: 0, max: 200 }) + ' ' + faker.address.street(),
        postcode: faker.address.zipCode('#####'),
        city: faker.address.city(),
        department: faker.helpers.arrayElement(departments),
        region: faker.helpers.arrayElement(regions),
    };
    const billing_address = {
        street: faker.datatype.number({ min: 0, max: 200 }) + ' ' + faker.address.street(),
        postcode: faker.address.zipCode('#####'),
        city: faker.address.city(),
        department: faker.helpers.arrayElement(departments),
        region: faker.helpers.arrayElement(regions),
    };
    const customer = await getRandomCustomer();
    const products = await getRandomProducts();
    const carrier = await getRandomCarrier();
    const shipping_fees = carrier.price;
    const payment_status = faker.helpers.arrayElement(['awaiting', 'paid', 'canceled']);
    const status = faker.helpers.arrayElement(getStatusBasedOnPayment(payment_status));
    const timeline: any[] = []

    let price = 0

    const getPrice = () => {
        for (let i = 0; i < products.length; i++) {
            const total = products[i].number * products[i].price
            price = price + total;
        }
    }
    getPrice()

    if (payment_status === 'awaiting') {
        timeline.push(
            {
                type: "payment_status",
                status: "awaiting",
                date: new Date()
            }
        )
    }
    if (payment_status === 'canceled') {
        timeline.push(
            {
                type: "payment_status",
                status: "awaiting",
                date: new Date()
            }, {
                type: "payment_status",
                status: "canceled",
                date: new Date()
            }
        )
    }
    if (payment_status === 'paid') {
        timeline.push(
            {
                type: "payment_status",
                status: "awaiting",
                date: new Date()
            }, {
                type: "payment_status",
                status: "paid",
                date: new Date()
            }
        )
    }
    if (status === 'accepted') {
        timeline.push(
            {
                type: "order_status",
                status: "accepted",
                date: new Date()
            }
        )
    }
    if (status === 'preparation') {
        timeline.push(
            {
                type: "order_status",
                status: "accepted",
                date: new Date()
            }, {
                type: "order_status",
                status: "preparation",
                date: new Date(),
                user: await getRandomUser()
            }
        )
    }
    if (status === 'completed') {
        timeline.push(
            {
                type: "order_status",
                status: "accepted",
                date: new Date()
            }, {
                type: "order_status",
                status: "preparation",
                date: new Date(),
                user: await getRandomUser()
            }, {
                type: "order_status",
                status: "completed",
                date: new Date(),
                user: await getRandomUser()
            }
        )
    }
    if (status === 'shipped') {
        timeline.push(
            {
                type: "order_status",
                status: "accepted",
                date: new Date()
            }, {
                type: "order_status",
                status: "preparation",
                date: new Date(),
                user: await getRandomUser()
            }, {
                type: "order_status",
                status: "completed",
                date: new Date(),
                user: await getRandomUser()
            }, {
                type: "order_status",
                status: "shipped",
                date: new Date(),
                user: await getRandomUser()
            }
        )
    }


    try {
        await CustomerModel.findByIdAndUpdate({
            _id: customer._id
        }, {
            $addToSet: {
                orders: _id
            }
        }, {
            new: true,
            runValidators: true,
            context: 'query',
        })
    } catch (err) {
        console.log(err)
    }

    let key = 0
    try {
        const count = await OrderModel.countDocuments();
        key = count + 1
    } catch (err) {
        console.log(err);
    }

    return {
        _id,
        key,
        date,
        payment_method,
        delivery_address,
        billing_address,
        customer,
        products,
        price: price.toFixed(2),
        shipping_fees,
        carrier,
        status,
        payment_status,
        timeline
    }
}

export async function createRandomOrders(length: number) {
    let response: any[] = []

    for (let i = 0; i < length; i++) {
        let fake = new OrderModel(await createRandomOrder())
        fake.save()
            .catch(err => console.log(err))

        response = [...response, fake]
    }
    return response
}