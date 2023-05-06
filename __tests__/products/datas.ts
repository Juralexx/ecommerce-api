import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import ProdutModel from '../../models/product.model.ts';
import CategoryModel from "../../models/category.model.ts";
import FilesModel from "../../models/files.model.ts";
import { convertStringToURL, randomNbID } from '../../utils/utils.js';
import { countries } from '../../utils/countries.js'

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getRandomCategory() {
    const category = await CategoryModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: category[0]._id,
    }
}

async function getRandomImages() {
    const images: any = await FilesModel.aggregate([{ $sample: { size: 2 } }])

    return images.map((image: any) => {
        return {
            _id: image._id,
        }
    })
}

const randomPromotion = () => {
    const i = randomIntFromInterval(0, 100)
    if (i > 90) {
        return faker.datatype.number({ min: 0, max: 50 })
    } else return 0
}

export async function createRandomProduct() {
    const _id = new mongoose.Types.ObjectId();
    const published = faker.datatype.boolean();
    const name = faker.lorem.words(5);
    const category = await getRandomCategory()
    const price = faker.datatype.float({ max: 300, precision: 0.01 });
    const variants = [...new Array(randomIntFromInterval(1, 5))]
        .map((_, i) => {
            return {
                _id: new mongoose.Types.ObjectId(),
                width: (20 * (i + 1)).toString(),
                height: (20 * (i + 2)).toString(),
                weight: (3 * (i + 2)).toString(),
                color: '',
                price: (price * ((i + 1) * 0.2)).toFixed(2),
                stock: faker.datatype.number({ min: 0, max: 500 }),
                ref: faker.random.numeric(7),
                promotion: randomPromotion(),
                taxe: faker.helpers.arrayElement([5.5, 20]),
                url: `${convertStringToURL(name)}-${randomNbID(8)}`,
                country: faker.helpers.arrayElement([...countries]),
                barcode: faker.datatype.number({ min: 1000000000, max: 9999999999 })
            }
        });
    const images = await getRandomImages();
    const description = faker.lorem.paragraphs(10);
    const content = faker.lorem.paragraphs(30);
    const tags: any[] = [];
    const orders: any[] = [];
    let details: any[] = [];

    const buildDetails = () => {
        for (let i = 0; i < randomIntFromInterval(0, 15); i++) {
            details = [...details, {
                title: faker.lorem.sentence(),
                content: faker.lorem.sentence(),
            }]
        }
    };
    buildDetails()

    return {
        _id,
        published,
        name,
        category,
        variants,
        images,
        description,
        content,
        tags,
        orders,
        details: details
    }
}

export async function createRandomProducts(length: number) {
    let response: any[] = []

    for (let i = 0; i < length; i++) {
        let fake = new ProdutModel(await createRandomProduct())
        fake.save()
            .catch(err => console.log(err))

        response = [...response, fake]
    }

    return response
}