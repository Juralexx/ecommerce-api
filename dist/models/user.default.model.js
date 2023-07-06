import mongoose from 'mongoose';
import { isEmailValid, isPasswordStrong, isValidName, isPhoneValid } from '../utils/utils.js';
var DefaultUserModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (val) { return isValidName(val); },
            message: 'Veuillez saisir un prénom valide.'
        }
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (val) { return isValidName(val); },
            message: 'Veuillez saisir un nom valide.'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (val) { return isEmailValid(val); },
            message: 'Veuillez saisir un email valide.'
        }
    },
    password: {
        type: String,
        minlength: 8,
        trim: true,
        validate: {
            validator: function (val) { return isPasswordStrong(val); },
            message: "Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :\n                ".concat('- Une majuscule', "\n                ").concat('- Une minuscule', "\n                ").concat('- Un chiffre', "\n                ").concat('- Un charactère spécial', "\n                ").concat('- Contenir 8 caractères')
        }
    },
    phone: {
        type: String,
        validate: {
            validator: function (val) {
                if (val)
                    isPhoneValid(val);
            },
            message: 'Veuillez saisir un numéro de téléphone valide'
        }
    }
}, {
    timestamps: true,
    minimize: false
});
export default DefaultUserModel;
