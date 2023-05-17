const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeature");
const catchAsyncError = require("../middleWares/catchAsyncErrors");

// create a new Product => api/v1/product/create
exports.create_product = catchAsyncError(async function (req, res) {
	await Product.create(req.body, function (product) {
		res.status(200).json({
			status: "success",
			product,
		});
	});
});
exports.add_image = catchAsyncError(async function (req, res) {
	const product = await Product.findById(req.query.productId);

	if (!product.id) {
		res.status(200).json({
			status: "failed",
			message: "Product not found",
		});
	}
	res.send(await product.addImage(req.file.filename));
});

//  get all products => /api/v1/products
exports.getProducts = catchAsyncError(async function (req, res) {
	const resPerPage = req.query.take || 100;
	const productsCount = await Product.countDocuments();
	const products = new APIFeatures(await Product.findAll(), req.query)
		.search()
		.filter()
		.pagination(resPerPage);
	res.status(200).json({
		status: "success",
		count: products.query.length,
		total: productsCount[0]["COUNT(*)"],
		products: products.query,
	});
});

// get single product => /api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async function (req, res, next) {
	const product = await Product.findById(req.params.id);
	console.log(product);
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

exports.updateProduct = catchAsyncError(async function (req, res) {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body);
	console.log(product);
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
exports.createReview = catchAsyncError(async function (req, res, next) {
	const { rating, comment, productId } = req.body;

	const review = {
		userId: req.user.id,
		name: req.user.name,
		rating: Number(rating),
		comment,
	};

	const product = await Product.findById(productId);

	const isReviewed = product.reviews.find((r) => r.userId === req.user.id);

	if (isReviewed) {
		product.reviews.forEach((rev) => {
			if (rev.userId === req.user.id) {
				rev.comment = comment;
				rev.rating = Number(rating);
			}
		});
	} else {
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}

	product.ratings =
		product.reviews.reduce((acc, item) => item.rating + acc, 0) /
		product.reviews.length;

	await product.updateReview(
		productId,
		review,
		product.reviews.length,
		product.ratings,
	);

	res.status(200).json({
		status: "success",
		review,
	});
});

// get product reviews => api/v1/reviews
exports.getReviews = catchAsyncError(async function (req, res, next) {
	const reviews = await Product.getReviews(req.query.id);
	res.status(200).json({
		status: "success",
		reviews: reviews,
	});
});

// delete product review => api/v1/review
exports.deleteReview = catchAsyncError(async function (req, res) {
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
