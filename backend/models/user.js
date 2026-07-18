const mongoose = require("mongoose");
const schema = mongoose.Schema;

const addressSchema = new schema({
    label:     { type: String, default: "Home" },
    fullName:  { type: String, default: "" },
    phone:     { type: String, default: "" },
    address:   { type: String, default: "" },
    city:      { type: String, default: "" },
    state:     { type: String, default: "" },
    pincode:   { type: String, default: "" },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ""
    },
    addresses: [addressSchema],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity: {
            type: Number,
            default: 1
        },
        size: {
            type: String,
            default: "M"
        }
    }]
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;