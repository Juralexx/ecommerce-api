import mongoose from 'mongoose'
import * as argon2 from 'argon2'
import { IUser, Roles, UserDocument } from '../types/types.ts';
import { isEmpty } from '../utils/utils.js';
import DefaultUserModel from './user.default.model.ts';
import { login } from './plugins.ts'

const UserModel = new mongoose.Schema<IUser, UserDocument>(
    {
        ...DefaultUserModel.obj,
        image: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'media',
        },
        role: {
            type: String,
            enum: Roles,
            required: true,
            default: Roles.user,
            validate: {
                validator: (val: string) => !isEmpty(val),
                message: 'Veuillez assigner un rôle.'
            }
        }
    },
    {
        timestamps: true,
        minimize: false
    }
);

UserModel.pre("save", async function (next) {
    this.password = await argon2.hash(this.password);
    next();
})

UserModel.plugin(login)

export default mongoose.model<IUser, UserDocument>("user", UserModel)