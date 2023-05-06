import mongoose from 'mongoose'
import * as argon2 from 'argon2'
import DefaultUserModel from './user.default.model.ts';
import { UserDocument, ICustomer } from '../types/types';
import { login } from './plugins.ts'
import { isValidPostcode } from '../utils/utils.js';

const CustomerModel = new mongoose.Schema<ICustomer, UserDocument>(
    {
        ...DefaultUserModel.obj,
        title: {
            type: String,
            enum: ['M', 'Mme'],
            required: true
        },
        birth: {
            type: Date,
        },
        addresses: {
            type: [],
            address: {
                street: {
                    type: String,
                    minLength: 5
                },
                postcode: {
                    type: String,
                    validate: {
                        validator: (val: string) => isValidPostcode(val),
                        message: 'Veuillez saisir un code postal valide.'
                    }
                },
                city: {
                    type: String,
                    minLength: 2
                },
                department: {
                    type: String,
                    minLength: 3
                },
                region: {
                    type: String,
                    minLength: 3
                }
            }
        },
        cart: {
            type: [],
            default: []
        },
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'order'
            }
        ],
        registration_date: {
            type: Date
        }
    },
    {
        timestamps: true,
        minimize: false
    }
);

CustomerModel.pre("save", async function (next) {
    this.password = await argon2.hash(this.password);
    next();
})

CustomerModel.plugin(login)

export default mongoose.model<ICustomer, UserDocument>("customer", CustomerModel)