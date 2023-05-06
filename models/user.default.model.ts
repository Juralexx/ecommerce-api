import mongoose from 'mongoose'
import { DefaultUser, UserDocument } from '../types/types.ts';
import { isEmailValid, isPasswordStrong, isValidName, isPhoneValid } from '../utils/utils.js';


const DefaultUserModel = new mongoose.Schema<DefaultUser, UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (val: string) => isValidName(val),
                message: 'Veuillez saisir un prénom valide.'
            }
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: (val: string) => isValidName(val),
                message: 'Veuillez saisir un nom valide.'
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: (val: string) => isEmailValid(val),
                message: 'Veuillez saisir un email valide.'
            }
        },
        password: {
            type: String,
            minlength: 8,
            trim: true,
            validate: {
                validator: (val: string) => isPasswordStrong(val),
                message: `Votre mot de passe ne respecte pas les conditions requises, celui-ci doit contenir au moins :
                ${'- Une majuscule'}
                ${'- Une minuscule'}
                ${'- Un chiffre'}
                ${'- Un charactère spécial'}
                ${'- Contenir 8 caractères'}`
            }
        },
        phone: {
            type: String,
            validate: {
                validator: (val: string) => isPhoneValid(val),
                message: 'Veuillez saisir un numéro de téléphone valide'
            }
        }
    },
    {
        timestamps: true,
        minimize: false
    }
);

export default DefaultUserModel