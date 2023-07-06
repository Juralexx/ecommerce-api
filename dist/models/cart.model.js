import mongoose from 'mongoose';
var CartModel = new mongoose.Schema({
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
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("cart", CartModel);
