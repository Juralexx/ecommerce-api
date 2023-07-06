import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { convertStringToURL } from '../../utils/utils.js';
import CategoryModel from '../../models/category.model.js';
import FilesModel from '../../models/files.model.js';

async function getRandomImage() {
    const image: any = await FilesModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: image[0]._id,
    }
}

export async function createRandomCategory() {
    const _id = new mongoose.Types.ObjectId();
    const name = faker.lorem.sentence(1);
    const content = faker.lorem.paragraph(10);
    const parent = faker.lorem.sentence(1);
    const link = convertStringToURL(name);
    const image = await getRandomImage();
    const promotions: [] = [];

    return {
        _id,
        name,
        content,
        parent,
        link,
        image,
        promotions
    }
}

export async function createRandomCategories(length: number) {
    let response: any[] = []

    for (let i = 0; i < length; i++) {
        const category = await createRandomCategory();

        await CategoryModel.create({ ...category })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response
}