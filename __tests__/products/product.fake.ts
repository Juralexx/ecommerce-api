import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import ProdutModel from '../../models/product.model.js';
import CategoryModel from "../../models/category.model.js";
import FilesModel from "../../models/files.model.js";
import { convertStringToURL, randomNbID } from '../../utils/utils.js';
import { countries } from '../../utils/countries.js'
import { ICategory, IProduct, Img } from 'types/types.js';

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get a random category from the 'categories' collection
 * @returns {mongoose.Types.ObjectId} A random category _id
 */

export async function getRandomCategory(): Promise<mongoose.Types.ObjectId> {
    const category: ICategory[] = await CategoryModel.aggregate([{ $sample: { size: 1 } }])
    return category[0]._id;
}

/**
 * Get random images from the 'medias' collection
 * @returns {mongoose.Types.ObjectId[]} Random images _id
 */

async function getRandomImages(): Promise<mongoose.Types.ObjectId[]> {
    const images: Img[] = await FilesModel.aggregate([{ $sample: { size: 2 } }]);
    return images.map(({ _id }) => {
        return _id;
    })
}

/**
 * Return a random number between 0 and 50
 * @returns {number} A random number between 0 and 50
 */

function randomPromotion(): number {
    const i = randomIntFromInterval(0, 100)
    if (i > 90) {
        return faker.datatype.number({ min: 0, max: 50 })
    } else return 0
}

export async function createRandomProduct(): Promise<IProduct> {
    const _id = new mongoose.Types.ObjectId();
    const published = faker.datatype.boolean();
    const name = faker.lorem.words(5);
    const category = await getRandomCategory();
    const price = faker.datatype.float({ min: 10, max: 50, precision: 0.01 });
    const variants = [...new Array(randomIntFromInterval(1, 5))]
        .map((_, i) => {
            return {
                _id: new mongoose.Types.ObjectId(),
                size: ((i + 1) * 3).toString(),
                height: (20 * (i + 2)).toString(),
                weight: (3 * (i + 2)).toString(),
                color: '',
                price: price * (i + 1),
                stock: faker.datatype.number({ min: 0, max: 500 }),
                ref: faker.random.numeric(7),
                promotion: randomPromotion(),
                taxe: faker.helpers.arrayElement([5.5, 20]),
                url: `${convertStringToURL(name)}-${randomNbID(8)}`,
                country: faker.helpers.arrayElement([...countries]),
                barcode: faker.datatype.number({ min: 1000000000, max: 9999999999 }).toString()
            }
        });
    const base_variant = variants.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
    const images = await getRandomImages();
    const description = faker.lorem.paragraphs(10);
    const content = faker.lorem.paragraphs(20);
    let details: any[] = [];

    for (let i = 0; i < randomIntFromInterval(0, 15); i++) {
        details = [...details, {
            title: faker.lorem.sentence(),
            content: faker.lorem.sentence(),
        }]
    }

    return {
        _id,
        published,
        name,
        category,
        variants,
        base_variant,
        images,
        description,
        content,
        details,
        promotions: []
    }
}

/**
 * @param length Number of products to create
 * @returns New products based on the `length` prop
 */

export async function createRandomProducts(length: number) {
    let products: any[] = [];

    for (let i = 0; i < length; i++) {
        const product = await createRandomProduct();

        await ProdutModel.create({ ...product })
            .then(docs => {
                products = [...products, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return products;
}

