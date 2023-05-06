import { faker } from '@faker-js/faker';
import { ICustomer } from '../../types/types'
import { departments, regions } from '../regions.js';
import mongoose from 'mongoose';
import { generateStrongPassword } from '../../utils/utils.js';
import CustomerModel from '../../models/customer.model.ts';

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createRandomCustomer(): ICustomer {
    const _id = new mongoose.Types.ObjectId();
    const sex = faker.name.sexType();
    const name = faker.name.firstName(sex);
    const lastname = faker.name.lastName();
    const email = faker.helpers.unique(faker.internet.email, [
        name,
        lastname,
    ]);
    const password = generateStrongPassword(20);
    const title = faker.helpers.arrayElement(['M', 'Mme']);
    const birth = faker.date.birthdate();
    const addresses = [...new Array(randomIntFromInterval(1, 5))].map(() => {
        return (
            {
                street: faker.address.street(),
                postcode: faker.address.zipCode('#####'),
                city: faker.address.city(),
                department: faker.helpers.arrayElement(departments),
                region: faker.helpers.arrayElement(regions),
            }
        )
    });
    const phone = faker.phone.number('06 ## ## ## ##');
    const cart: any[] = [];
    const orders: any[] = [];
    const registration_date = faker.date.past();

    return {
        _id,
        name,
        lastname,
        email,
        password,
        title,
        birth,
        addresses,
        phone,
        cart,
        orders,
        registration_date
    }
}

export async function createRandomCustomers(length: number) {
    let response: any[] = []
    for (let i = 0; i < length; i++) {
        let fake = new CustomerModel(createRandomCustomer())
        fake.save()
            .catch(err => console.log(err))

        response = [...response, fake]
    }

    return response
}