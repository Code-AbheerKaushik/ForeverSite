const express = require("express");
const Router  = express.Router();
const { requireAuth } = require("../middlewares/requireAuth");
const User = require("../models/user");

// ─── GET Profile ───────────────────────────────────────────────────────────
Router.get("/profile", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password -cart");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── UPDATE Profile (name + phone) ────────────────────────────────────────
Router.put("/profile", requireAuth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone },
            { new: true }
        ).select("-password -cart");
        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── ADD Address ──────────────────────────────────────────────────────────
Router.post("/address", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const { label, fullName, phone, address, city, state, pincode } = req.body;

        // If this is the first address, make it default automatically
        const isDefault = user.addresses.length === 0;

        user.addresses.push({ label, fullName, phone, address, city, state, pincode, isDefault });
        await user.save();

        res.json({ success: true, message: "Address added", addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── EDIT Address ─────────────────────────────────────────────────────────
// NOTE: This route must come BEFORE the default route to avoid :addressId = "default"
Router.put("/address/:addressId", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const addr = user.addresses.id(req.params.addressId);
        if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

        const { label, fullName, phone, address, city, state, pincode } = req.body;
        if (label    !== undefined) addr.label    = label;
        if (fullName !== undefined) addr.fullName = fullName;
        if (phone    !== undefined) addr.phone    = phone;
        if (address  !== undefined) addr.address  = address;
        if (city     !== undefined) addr.city     = city;
        if (state    !== undefined) addr.state    = state;
        if (pincode  !== undefined) addr.pincode  = pincode;

        await user.save();
        res.json({ success: true, message: "Address updated", addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── SET Default Address ──────────────────────────────────────────────────
Router.put("/address/default/:addressId", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Clear all defaults first
        user.addresses.forEach(a => { a.isDefault = false; });

        // Set the chosen one
        const addr = user.addresses.id(req.params.addressId);
        if (!addr) return res.status(404).json({ success: false, message: "Address not found" });
        addr.isDefault = true;

        await user.save();
        res.json({ success: true, message: "Default address set", addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── DELETE Address ───────────────────────────────────────────────────────
Router.delete("/address/:addressId", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const addrIndex = user.addresses.findIndex(
            a => a._id.toString() === req.params.addressId
        );
        if (addrIndex === -1) return res.status(404).json({ success: false, message: "Address not found" });

        const wasDefault = user.addresses[addrIndex].isDefault;
        user.addresses.splice(addrIndex, 1);

        // If the deleted address was the default and others exist, make first one default
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json({ success: true, message: "Address deleted", addresses: user.addresses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = Router;
