const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/products");

const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { products, shippingAddress, paymentMethod } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "No products in order" });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            return res.status(400).json({ success: false, message: "Missing shipping address information" });
        }

        // Calculate total amount on the server (never trust client prices)
        let subtotal = 0;
        const dbProducts = [];

        for (const item of products) {
            const dbProduct = await Product.findById(item.product._id || item.product);
            if (!dbProduct) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }
            subtotal += dbProduct.price * item.quantity;
            dbProducts.push({
                product: dbProduct._id,
                quantity: item.quantity,
                size: item.size
            });
        }

        const shippingFee = subtotal > 0 ? 10 : 0; // Match Cart.js delivery fee of $10.00 or $0.00 if cart is empty
        const totalAmount = subtotal + shippingFee;

        // Create the order in the database
        const newOrder = await Order.create({
            user: userId,
            products: dbProducts,
            shippingAddress,
            amount: totalAmount,
            paymentMethod: paymentMethod || "COD",
            paymentStatus: "pending",
            orderStatus: "placed"
        });

        // Clear the user's cart in the database
        const user = await User.findById(userId);
        if (user) {
            user.cart = [];
            await user.save();
        }

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId: newOrder._id,
            amount: newOrder.amount
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during order creation",
            error: error.message
        });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .populate("products.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during fetching orders",
            error: error.message
        });
    }
};

module.exports = { createOrder, getUserOrders };
