import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import ProductModel from '../../models/product.model.js';
import CartModel from '../../models/cart.model.js';

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getRandomProducts() {
    const products: any = await ProductModel.aggregate([{ $sample: { size: randomIntFromInterval(1, 8) } }])

    return products.map((product: any) => {
        const variant = faker.helpers.arrayElement([...product.variants])
        return {
            product: {
                _id: product._id
            },
            variant: {
                ...variant
            },
            quantity: randomIntFromInterval(1, 4)
        }
    })
}

export async function createRandomCart() {
    const _id = new mongoose.Types.ObjectId();
    const products = await getRandomProducts();

    return {
        _id,
        products
    }
}

export async function createRandomCarts(length: number) {
    let response: any[] = [];

    for (let i = 0; i < length; i++) {
        const cart = await createRandomCart();

        await CartModel.create({ ...cart })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response;
}