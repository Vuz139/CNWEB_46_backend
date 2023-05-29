const { query } = require("../db/database");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apifeature");

class Order {
	constructor(order) {
		this.id = order.id || null;
		this.shippingInfo = order.shippingInfo || {};
		// this.city = order.city || null;
		// this.address = order.address || null;
		// this.phoneNo = order.phoneNo || null;
		// this.postalCode = order.postalCode || null;
		// this.country = order.country || null;
		this.orderStatus = order.orderStatus || "pending";
		this.user = order.user || null;
		this.itemsOrder = order.itemsOrder || [];
		this.itemsPrice = order.itemsPrice || 0;
		this.taxPrice = order.taxPrice || 0;
		this.paidAt = order.paidAt || null;
		this.paymentInfo = order.paymentInfo || "pending";
		this.totalPrice = order.totalPrice || 0;
		this.shippingPrice = order.shippingPrice || 0;
		this.delieverAt = order.delieverAt || null;
		this.createdAt = order.createdAt || Date.now;
	}
	// create new order
	async createOrder() {
		if (this.itemsOrder.length < 1)
			return new ErrorHandler("Dont have any order items", 401);

		// create ShippingIn4
		const sql_shipping =
			"INSERT INTO shipping_info (address, phoneNo, city, country, postalCode) VALUES (?, ?, ?, ?, ?)";
		const params_shipping = [
			this.shippingInfo.address,
			this.shippingInfo.phoneNo,
			this.shippingInfo.city,
			this.shippingInfo.country,
			this.shippingInfo.postalCode,
		];

		const res_shippingInfo = await query(sql_shipping, params_shipping);
		this.shippingInfo.id = res_shippingInfo.insertId;

		// create Order
		const sql_order =
			"INSERT INTO orders (idUser, idShippingInfo, paymentInfo, itemsPrice, taxPrice, orderStatus, totalPrice, shippingPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
		const params_order = [
			this.user.id,
			this.shippingInfo.id,
			this.paymentInfo,
			this.itemsPrice,
			this.taxPrice,
			this.orderStatus,
			this.totalPrice,
			this.shippingPrice,
		];

		const res_order = await query(sql_order, params_order);
		this.id = res_order.insertId;
		// insert item order
		for (const item of this.itemsOrder) {
			const sql_orderItem =
				"INSERT INTO itemorder (idOrder, idProduct, amount) VALUES (?,?,?)";
			const params_orderItem = [this.id, item.id, item.amount];
			await query(sql_orderItem, params_orderItem);
		}

		return this;
	}
	static async getOrders(query) {
		const { skip, take } = query;

		const sql =
			"SELECT * FROM orders ORDER BY orderStatus ASC OFFSET ? LIMIT ?";
		const res = await query(sql, [skip, take]);

		return res;
	}
}

module.exports = Order;
