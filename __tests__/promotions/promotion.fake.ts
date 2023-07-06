import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import PromotionModel from '../../models/promotion.model.js';
import ProductModel from '../../models/product.model.js';
import CategoryModel from "../../models/category.model.js";

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function getRandomProducts() {
    const products: any = await ProductModel.aggregate([{ $sample: { size: randomIntFromInterval(0, 15) } }])

    return products.map((product: any) => {
        return {
            _id: product._id
        }
    })
}

export async function getRandomCategories() {
    const categories: any = await CategoryModel.aggregate([{ $sample: { size: randomIntFromInterval(0, 3) } }])

    return categories.map((category: any) => {
        return {
            _id: category._id
        }
    })
}

export async function createRandomPromotion() {
    const _id = new mongoose.Types.ObjectId();
    const type = faker.helpers.arrayElement(['percentage', 'fixed']);
    const value = faker.helpers.arrayElement([10, 20, 30]);
    const code = faker.lorem.words(1).toUpperCase() + value;
    const description = faker.lorem.sentence();
    const dates = faker.date.betweens('2022-12-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z', 2);
    const start_date = dates[0];
    const end_date = dates[1];

    let is_active = false;

    if (start_date < new Date() && end_date > new Date()) {
        is_active = true;
    }

    let condition = {
        type: faker.helpers.arrayElement(['all', 'products', 'categories']),
        products: [] as mongoose.Types.ObjectId[],
        categories: [] as mongoose.Types.ObjectId[]
    };

    if (condition.type !== 'all') {
        condition = {
            ...condition,
            products: await getRandomProducts(),
            categories: await getRandomCategories()
        };
    };

    if (condition.type !== 'all') {
        if (condition.categories.length > 0) {
            condition.categories.forEach(async category => {
                try {
                    await ProductModel.updateMany({
                        category: category._id
                    }, {
                        $addToSet: {
                            promotions: _id,
                        },
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })
                } catch (err) {
                    console.log(err)
                }
            })
        }
        if (condition.products.length > 0) {
            condition.products.forEach(async product => {
                try {
                    await ProductModel.findByIdAndUpdate({
                        _id: product._id
                    }, {
                        $addToSet: {
                            promotions: _id,
                        },
                    }, {
                        new: true,
                        runValidators: true,
                        context: 'query',
                    })
                } catch (err) {
                    console.log(err)
                }
            })
        }
    } else {
        await ProductModel.updateMany({
            $addToSet: {
                promotions: _id,
            },
        }, {
            new: true,
            runValidators: true,
            context: 'query',
        })
    }

    return {
        _id,
        type,
        code,
        value,
        description,
        start_date,
        end_date,
        condition,
        is_active
    }
}

export async function createRandomPromotions(length: number) {
    let response: any[] = [];

    for (let i = 0; i < length; i++) {
        const promotion = await createRandomPromotion();

        await PromotionModel.create({ ...promotion })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response;
}