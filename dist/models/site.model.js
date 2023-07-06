import mongoose from 'mongoose';
import { isEmailValid, isPhoneValid } from '../utils/utils.js';
var SiteModel = new mongoose.Schema({
    denomination: {
        type: String,
        required: true,
        trim: true,
    },
    slogan: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        validate: {
            validator: function (val) { return isEmailValid(val); },
            message: 'Veuillez saisir un email valide.'
        }
    },
    phone: {
        type: String,
        validate: {
            validator: function (val) { return isPhoneValid(val); },
            message: 'Veuillez saisir un numéro de téléphone valide'
        }
    },
    address: {
        type: String,
    },
    street: {
        type: String,
    },
    postal_code: {
        type: String,
    },
    city: {
        type: String,
    },
    openings: [
        {
            day: {
                type: String,
                required: true
            },
            hours: {
                type: String,
                required: true
            }
        }
    ],
    social_networks: [
        {
            type: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("site", SiteModel);
