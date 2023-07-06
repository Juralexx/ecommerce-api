import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { convertStringToURL } from '../../utils/utils.js';
import PageModel from '../../models/page.model.js';
import FilesModel from '../../models/files.model.js';

async function getRandomImage() {
    const image: any = await FilesModel.aggregate([{ $sample: { size: 1 } }])
    return {
        _id: image[0]._id,
    }
}

export async function createRandomPage() {
    const _id = new mongoose.Types.ObjectId();
    const published = faker.datatype.boolean();
    const title = faker.lorem.sentence(4);
    const content = faker.lorem.paragraph(10);
    const category_name = faker.helpers.arrayElement(['Jardin', 'Plantes', 'Agrumes', 'Plantes méditéranéennes', 'Entretien']);
    const category = {
        name: category_name,
        url: convertStringToURL(category_name)
    };
    const image = await getRandomImage();
    const link = convertStringToURL(title);

    return {
        _id,
        published,
        title,
        content,
        category,
        link,
        image
    }
}

export async function createRandomPages(length: number) {
    let response: any[] = [];

    for (let i = 0; i < length; i++) {
        const page = await createRandomPage();

        await PageModel.create({ ...page })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response;
}