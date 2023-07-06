import mongoose from 'mongoose';
var PromotionModel = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        unique: true,
        required: true
    },
    value: {
        type: Number,
        min: 1,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
    },
    condition: {
        type: {
            type: String,
            required: true
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            }
        ],
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'category',
                required: true
            }
        ]
    },
    is_active: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("promotion", PromotionModel);
