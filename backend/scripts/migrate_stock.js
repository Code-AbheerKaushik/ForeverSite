/**
 * One-time migration: set stock = 100 for all products that currently have stock = 0
 * (i.e., products added before the stock field was introduced).
 *
 * Run with: node backend/scripts/migrate_stock.js
 */

const mongoose = require("mongoose");
const Product  = require("../models/products");

const MONGO_URI = "mongodb+srv://AbheerKaushik:abheer02@cluster0.flsd7n2.mongodb.net/users";
const DEFAULT_STOCK = 100;  // ← change this if you want a different default

async function run() {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const result = await Product.updateMany(
        { $or: [{ stock: { $exists: false } }, { stock: 0 }] },
        { $set: { stock: DEFAULT_STOCK } }
    );

    console.log(`✅ Updated ${result.modifiedCount} products → stock set to ${DEFAULT_STOCK}`);
    await mongoose.disconnect();
}

run().catch(err => {
    console.error("Migration failed:", err.message);
    process.exit(1);
});
