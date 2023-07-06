import mongoose, { Schema } from 'mongoose'

const CarrierModel: Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        delivery_estimate: {
            minimum: {
                type: Number,
                min: 0,
                required: true
            },
            maximum: {
                type: Number,
                min: 0,
                required: true
            },
        },
        published: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        minimize: false
    }
);


export default mongoose.model("carrier", CarrierModel)