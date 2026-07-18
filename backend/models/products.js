const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: [String],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    bestseller: {
        type: Boolean,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    }
});

productSchema.index({ bestseller: 1 });
productSchema.index({ category: 1, subCategory: 1 });

module.exports = mongoose.model("product", productSchema);
