const express = require("express");

const router = express.Router();

const {
	create_product,
	getProducts,
	getSingleProduct,
	updateProduct,
	deleteProduct,
	createReview,
	getReviews,
	deleteReview,
} = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.post("/product/create", create_product);
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

router.get("/reviews", isAuthenticatedUser, getReviews);
router.post("/review", isAuthenticatedUser, createReview);
router.delete(
	"/review",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	deleteReview,
);
module.exports = router;
