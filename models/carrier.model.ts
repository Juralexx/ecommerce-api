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
        published: {
            type: Boolean,
            default: false
        }
    }
);


export default mongoose.model("carrier", CarrierModel)