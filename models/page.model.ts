import mongoose, { Schema } from 'mongoose'
import { isValidPathname } from '../utils/utils.js';

const PageModel: Schema = new mongoose.Schema(
    {
        published: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: (val: string) => isValidPathname(val),
                message: 'Veuillez saisir une URL valide.'
            }
        }
    }
);


export default mongoose.model("page", PageModel)