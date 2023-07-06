import mongoose, { Schema } from 'mongoose'

const CartModel: Schema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product',
                    required: true,
                },
                variant: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                quantity: {
                    type: Number,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true,
        minimize: false
    }
);


export default mongoose.model("cart", CartModel)