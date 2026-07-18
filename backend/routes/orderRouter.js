const express = require("express");
const Router = express.Router();
const { requireAuth } = require("../middlewares/requireAuth");
const { createOrder, getUserOrders } = require("../controllers/orderController");

Router.post("/create", requireAuth, createOrder);
Router.get("/myorders", requireAuth, getUserOrders);

module.exports = Router;
