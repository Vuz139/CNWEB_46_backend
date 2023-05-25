const express = require("express");

const router = express.Router();

const {
	createOrder,
	updateOrder,
	deleteOrder,
	getOrders,
	getOrderById,
} = require("../controllers/order.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.get("/orders", isAuthenticatedUser, getOrders);
router.post("/order", isAuthenticatedUser, createOrder);
router.put("/order/:id", isAuthenticatedUser, updateOrder);
router.get("/order/:id", isAuthenticatedUser, getOrderById);
router.delete("/order/:id", isAuthenticatedUser, deleteOrder);

module.exports = router;
