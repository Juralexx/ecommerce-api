import mongoose from 'mongoose';
var ProductModel = new mongoose.Schema({
    published: {
        type: Boolean,
        required: true,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    images: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'media',
            required: true
        }],
    variants: [{
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                default: new mongoose.Types.ObjectId()
            },
            ref: { type: String },
            size: { type: String },
            height: { type: String },
            weight: { type: String },
            color: { type: String },
            price: {
                type: Number,
                min: 1
            },
            stock: { type: Number },
            promotion: { type: Number },
            taxe: { type: Number },
            country: {
                type: Object,
                default: { name: "France", code: "FR" }
            },
            url: {
                type: String,
                required: true,
                trim: true
            },
            barcode: { type: String }
        }],
    base_variant: {
        type: Object,
        required: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    details: {
        type: [],
        detail: {
            name: {
                type: String
            },
            value: {
                type: String
            }
        }
    },
    promotions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'promotion',
        }]
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("product", ProductModel);
