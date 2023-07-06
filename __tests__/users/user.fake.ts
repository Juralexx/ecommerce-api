import { faker } from '@faker-js/faker';
import { IUser, UserRole } from '../../types/types.js'
import mongoose from 'mongoose';
import { generateStrongPassword } from '../../utils/utils.js';
import UserModel from '../../models/user.model.js';

export function createRandomUser(): IUser {
    const _id = new mongoose.Types.ObjectId();
    const name = faker.name.firstName();
    const lastname = faker.name.lastName();
    const email = faker.helpers.unique(faker.internet.email, [
        name,
        lastname,
    ]);
    const password = generateStrongPassword(20);
    const role: UserRole = faker.helpers.arrayElement(['developer', 'admin', 'editor', 'user']);
    const phone = faker.phone.number('06 ## ## ## ##');

    return {
        _id,
        name,
        lastname,
        email,
        password,
        role,
        phone
    }
}

export async function createRandomUsers(length: number) {
    let response: any[] = [];

    for (let i = 0; i < length; i++) {
        const user = createRandomUser();

        await UserModel.create({ ...user })
            .then(docs => {
                response = [...response, docs];
            })
            .catch(err => { throw new Error(err) })
    }

    return response;
}