import { faker } from '@faker-js/faker';
import { ICarrier } from '../../types/types.js'
import mongoose from 'mongoose';
import CarrierModel from '../../models/carrier.model.js';

export function createRandomCarrier(): ICarrier {
    const _id = new mongoose.Types.ObjectId();
    const published = faker.datatype.boolean();
    const name = faker.lorem.words(2);
    const description = faker.lorem.sentence(10);
    const price = faker.datatype.float({ max: 10, precision: 0.1 });
    const delivery_estimate = {
        maximum: faker.datatype.number({ min: 2, max: 4 }),
        minimum: faker.datatype.number({ min: 5, max: 8 })
    }

    return {
        _id,
        published,
        name,
        description,
        price,
        delivery_estimate
    }
}

export async function createRandomCarriers(length: number) {
    let response: any[] = [];

    for (let i = 0; i < length; i++) {
        const carrier = createRandomCarrier();

        await CarrierModel.create({ ...carrier })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response;
}