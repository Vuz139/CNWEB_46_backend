const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeature");
const catchAsyncErrors = require("../middleWares/catchAsyncErrors");
const { query } = require("../db/database");

// create a new Product => api/v1/product/create
exports.create_product = catchAsyncErrors(async function (req, res) {
	await Product.create(req.body, function (product) {
		res.status(200).json({
			status: "success",
			product,
		});
	});
});
exports.add_image = catchAsyncErrors(async function (req, res) {
	const product = await Product.findById(req.query.productId);

	if (!product.id) {
		res.status(200).json({
			status: "failed",
			message: "Product not found",
		});
	}
	console.log(">>>file: ", req.file.filename);
	res.send(await product.addImage(req.file.filename));
});

//  get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async function (req, res) {
	const take = Number(req.query.take) || 10;
	const skip = Number(req.query.skip) || 0;
	const page = Number(req.query.page) || 1;

	const orderBy = req.query.orderBy;
	const array = orderBy.slice(1, orderBy.length - 1).split(",");

	const products = new APIFeatures(
		await Product.findAll({ orderBy: array, take, skip }),
		req.query,
	)
		.search()
		.filter()
		.pagination(take);
	res.status(200).json({
		status: "success",
		take,
		page,
		total: products.total,
		products: products.query,
	});
});

exports.getProductTop = catchAsyncErrors(async function (req, res, next) {
	const sqlCategory = "SELECT category FROM products GROUP BY category";
	const category = (await query(sqlCategory, [])).map(
		(category) => category.category,
	);
	const sqlPrice = "SELECT price FROM products order by price DESC LIMIT 1";
	const price = (await query(sqlPrice, []))[0].price;

	const sqlSeller = "SELECT seller from products group by seller";
	const seller = (await query(sqlSeller, [])).map((seller) => seller.seller);
	res.status(200).json({
		status: "success",
		data: {
			category,
			price,
			seller,
		},
	});
});

// get single product => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async function (req, res, next) {
	const product = await Product.findById(req.params.id);
	// console.log(product);
	if (!product) {
		return res.status(404).json({
			status: "error",
			message: "Product not found",
		});
	}
	res.status(200).json({
		status: "success",
		product,
	});
});

// update product => /api/v1/admin/product/:id

exports.updateProduct = catchAsyncErrors(async function (req, res) {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body);
	// console.log(product);
	if (!product) {
		return res.status(404).json({
			status: "error",
			message: "Product not found",
		});
	}

	res.status(200).json({
		status: "success",
		product,
	});
});
// delete product => /api/v1/admin/product/:id

exports.deleteProduct = async function (req, res) {
	const product = await Product.deleteProduct(req.params.id);
	if (!product) {
		return res.status(404).json({
			status: "error",
			message: "Product not found",
		});
	}
	res.status(200).json({
		status: "success",
		product,
	});
};

// create a new review Product => /api/v1/review
exports.createReview = catchAsyncErrors(async function (req, res, next) {
	const { rating, comment, productId } = req.body;

	const review = {
		userId: req.user.id,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find((r) => r.idUser === req.user.id);

	if (isReviewed) {
		product.reviews.forEach((rev) => {
			if (rev.idUser === req.user.id) {
				rev.comment = comment;
				rev.rating = Number(rating);
			}
		});
		const sql =
			"UPDATE reviews SET comment = ?, rating = ?  WHERE idProduct =? AND idUser = ?";
		const params = [
			review.comment,
			review.rating,
			product.id,
			review.userId,
		];
		await query(sql, params);
	} else {
		product.reviews.push(review);
		product.numOfRev += 1;
		const sql =
			"INSERT INTO reviews (idProduct, idUser, comment, rating) VALUES (?,?, ?, ?)";
		const params = [
			product.id,
			review.userId,
			review.comment,
			review.rating,
		];
		await query(sql, params);
	}

	product.ratings =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) /
		product.numOfRev;

	await product.updateReview(
		productId,

		product.numOfRev,
		product.ratings,
	);

	res.status(200).json({
		status: "success",
		review,
	});
});

// get product reviews => api/v1/reviews
exports.getReviews = catchAsyncErrors(async function (req, res) {
	const { take = 5, skip = 0 } = req.query;
	const { reviews, total } = await Product.getReviews({
		id: req.params.id,
		take,
		skip,
	});
	res.status(200).json({
		status: "success",
		reviews: reviews,
		total,
	});
});

// delete product review => api/v1/review
exports.deleteReview = catchAsyncErrors(async function (req, res) {
	const product = await Product.findById(req.query.idProduct);

	const reviews = product.reviews.filter(
		(review) => review.id.toString() !== req.query.idReview.toString(),
	);

	product.numOfReviews = reviews.length;
	if (reviews.length > 0) {
		product.ratings =
			reviews.reduce((acc, item) => item.rating + acc, 0) /
			reviews.length;
	} else {
		product.ratings = 0;
	}
	product.updateReview(
		req.query.idProduct,
		null,
		product.numOfReviews,
		product.ratings,
	);
	await Product.deleteReview(req.query.idReview);
	res.status(200).json({
		status: "success",
		reviews,
	});
});

// get images producct
exports.getImages = async function (req, res) {
	const currProd = await Product.findById(req.params.id);
	res.send(await currProd.getImages());
};
exports.removeImage = async function (req, res) {
	res.send(await Product.removeImage(req.params.id));
};
