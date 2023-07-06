import mongoose from 'mongoose';
import { isValidPathname } from '../utils/utils.js';
var CategoryModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
    },
    parent: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (val) { return isValidPathname(val); },
            message: 'Veuillez saisir une URL valide.'
        }
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'media',
        required: true
    },
    promotions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'promotion',
        }
    ]
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("category", CategoryModel);
