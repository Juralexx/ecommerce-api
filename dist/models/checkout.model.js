import mongoose from 'mongoose';
var CheckoutModel = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    delivery_address: {
        type: Object,
        required: true
    },
    billing_address: {
        type: Object,
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            variant: {
                type: Object
            },
            original_price: {
                type: Number,
                required: true,
            },
            promotion: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    price: {
        type: Number,
        required: true
    },
    shipping_fees: {
        type: Number,
        required: true
    },
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carrier',
        required: true,
    },
    payment_status: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("checkout", CheckoutModel);
