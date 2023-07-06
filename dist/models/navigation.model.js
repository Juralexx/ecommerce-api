import mongoose from 'mongoose';
import { isValidPathname } from '../utils/utils.js';
var NavigationModel = new mongoose.Schema({
    navigation: [
        {
            id: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            name: {
                type: String,
                trim: true,
                required: true,
            },
            link: {
                type: String,
                trim: true,
                required: [
                    function () { return this.type === 'link'; },
                    'Veuillez renseigner le lien de cette onglet de navigation.'
                ],
                validate: {
                    validator: function (val) { return isValidPathname(val); },
                    message: 'Veuillez saisir une URL valide.'
                }
            },
            links: {
                type: Array,
                id: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    trim: true,
                    required: true,
                },
                link: {
                    type: String,
                    required: true,
                    validate: {
                        validator: function (val) { return isValidPathname(val); },
                        message: 'Veuillez saisir une URL valide.'
                    }
                },
                required: [
                    function () { return this.type === 'submenu'; },
                    'Veuillez renseigner les liens du sous-menu.'
                ]
            }
        }
    ]
}, {
    timestamps: true
});
export default mongoose.model("navigation", NavigationModel);
