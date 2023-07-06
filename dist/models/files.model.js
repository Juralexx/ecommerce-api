import mongoose from 'mongoose';
var FileModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    extension: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    minimize: false
});
export default mongoose.model("media", FileModel);
