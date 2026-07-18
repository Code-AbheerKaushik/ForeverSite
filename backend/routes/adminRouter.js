const express = require("express");
const Router = express.Router();
const { requireAdmin } = require("../middlewares/requireAdmin");
const Product = require("../models/products");
const Order = require("../models/order");
const User = require("../models/user");

// ─── Dashboard Stats ───────────────────────────────────────────────────────
Router.get("/stats", requireAdmin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders   = await Order.countDocuments();
        const totalCustomers = await User.countDocuments();

        const activeStatuses = ["placed", "packed", "shipped"];
        const activeOrders   = await Order.countDocuments({ orderStatus: { $in: activeStatuses } });
        const deliveredOrders = await Order.countDocuments({ orderStatus: "delivered" });

        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        res.json({ success: true, data: { totalProducts, totalOrders, totalCustomers, activeOrders, deliveredOrders, totalRevenue } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Recent Orders (last 10) ───────────────────────────────────────────────
Router.get("/recent-orders", requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "email")
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── All Products (admin — no limit, supports search & category) ───────────
Router.get("/products", requireAdmin, async (req, res) => {
    try {
        const { search, category } = req.query;
        let filter = {};
        if (category) filter.category = category;
        if (search)   filter.name = { $regex: search, $options: "i" };
        const products = await Product.find(filter).sort({ _id: -1 });
        res.json({ success: true, data: products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Update Product ────────────────────────────────────────────────────────
Router.put("/products/:id", requireAdmin, async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Delete Product ────────────────────────────────────────────────────────
Router.delete("/products/:id", requireAdmin, async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── All Orders ────────────────────────────────────────────────────────────
Router.get("/orders", requireAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "email")
            .populate("products.product", "name image price")
            .sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Single Order Detail ───────────────────────────────────────────────────
Router.get("/orders/:id", requireAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "email")
            .populate("products.product");
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── Update Order Status ───────────────────────────────────────────────────
Router.put("/orders/:id/status", requireAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = Router;
