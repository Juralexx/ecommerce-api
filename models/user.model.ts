import mongoose from 'mongoose'
import { IUser, Roles, UserDocument } from '../types/types.js';
import { isEmpty } from '../utils/utils.js';
import DefaultUserModel from './user.default.model.js';
import { login } from './plugins.js'
import bcrypt from 'bcryptjs'

const UserModel = new mongoose.Schema<IUser, UserDocument>({
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
}, {
    timestamps: true,
    minimize: false
});

//Hash password before user document creation
UserModel.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserModel.plugin(login);

export default mongoose.model<IUser, UserDocument>("user", UserModel);


