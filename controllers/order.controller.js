const Order = require("../models/order.model");
const catchAsyncError = require("../middlewares/catchAsyncErrors");
const { query } = require("../db/database");
const Product = require("../models/product.model");
const User = require("../models/user.model");
exports.createOrder = catchAsyncError(async (req, res, next) => {
	// const {
	//     orderItems,
	//     shippingInfo,
	//     paymentInfo,
	//     itemPrice,
	//     taxPrice,
	//     shippingPrice,
	//     totalPrice,
	// } = req.body;

	const order = new Order(req.body);
	order.user = req.user;
	try {
		const newOrder = await order.createOrder();
		res.status(200).json({
			status: "success",
			data: newOrder,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err,
		});
	}
});

// get Order by id
exports.getOrderById = catchAsyncError(async (req, res) => {
	const orderId = req.params.id;
	try {
		const sql = "SELECT * FROM orders WHERE id = ?";
		const params = [orderId];
		const order = (await query(sql, params))[0];

		const sqlItem = "SELECT * FROM itemorder WHERE idOrder = ?";
		const items = await query(sqlItem, params);

		order.products = [];
		for (let i = 0; i < items.length; i++) {
			const product = await Product.findById(items[i].idProduct);
			order.products.push(product);
		}

		const sqlShipping = "SELECT * FROM shipping_info  WHERE id = ?";

		order.shipping_info = await query(sqlShipping, [order.idShippingInfo]);
		const user = await User.findById(order.idUser);
		order.user = user;
		res.status(200).json({
			status: "success",
			data: {
				...order,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: error.err });
	}
});

// update order (payment, delivery status)
exports.updateOrder = catchAsyncError(async (req, res, next) => {
	const id = req.params.id;
	const body = req.body;

	for (const key in body) {
		await query(
			`UPDATE orders SET ${key}="${body[key]}" WHERE id = ${id}`,
			[],
		);
	}
	res.send(await query("SELECT * FROM orders WHERE id = ?", [id]));
});

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
	const id = req.params.id;
	const sql = "DELETE FROM orders WHERE id =?";
	const ress = await query(sql, [id]);
	res.json({
		data: ress,
	});
});

exports.getOrders = catchAsyncError(async (req, res, next) => {
	console.log(req.query);
	const { skip = 0, take = 10, status = "%%" } = req.query;
	const newStatus = `%${status}%`;

	const sql =
		"SELECT * FROM orders INNER JOIN shipping_info sp ON orders.idShippingInfo = sp.id WHERE orders.orderStatus LIKE ? ORDER BY orderStatus ASC LIMIT ? OFFSET ? ";
	const data = await query(sql, [newStatus, take, skip]);
	const total = (
		await query(
			"SELECT COUNT(*) AS total FROM orders WHERE orders.orderStatus LIKE ?",
			[newStatus],
		)
	)[0].total;
	console.log(total);
	res.status(200).json({
		status: "success",
		data,
		total,
	});
});
