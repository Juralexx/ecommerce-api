import mongoose from 'mongoose'
import DefaultUserModel from './user.default.model.js';
import { UserDocument, ICustomer } from '../types/types';
import { login } from './plugins.js'
import { isValidPostcode } from '../utils/utils.js';
import bcrypt from 'bcryptjs'

const CustomerModel = new mongoose.Schema<ICustomer, UserDocument>(
    {
        ...DefaultUserModel.obj,
        title: {
            type: String,
            enum: ['M', 'Mme'],
            required: true,
            default: 'M'
        },
        birth: {
            type: Date,
        },
        addresses: {
            type: [],
            address: {
                name: {
                    type: String,
                    required: true
                },
                lastname: {
                    type: String,
                    required: true
                },
                society: {
                    type: String,
                },
                street: {
                    type: String,
                    required: true,
                    minLength: 5
                },
                complement: {
                    type: String
                },
                postcode: {
                    type: String,
                    required: true,
                    validate: {
                        validator: (val: string) => isValidPostcode(val),
                        message: 'Veuillez saisir un code postal valide.'
                    }
                },
                city: {
                    type: String,
                    required: true,
                    minLength: 2
                },
                department: {
                    type: String
                },
                region: {
                    type: String
                },
                phone: {
                    type: String,
                    required: true
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

//Avant le sauvegarde du document dans la BDD nous hashons le mot de passe
CustomerModel.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

CustomerModel.plugin(login)

export default mongoose.model<ICustomer, UserDocument>("customer", CustomerModel)