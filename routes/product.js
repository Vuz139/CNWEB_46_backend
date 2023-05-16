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
	add_image,
	deleteReview,
	getImages,
} = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer.config");

router.post("/product", create_product);
router.get("/products", getProducts);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

router.post("/product/image", upload.single("file"), add_image);
router.get("/product/:id/image/", getImages);

router.get("/reviews", isAuthenticatedUser, getReviews);
router.post("/review", isAuthenticatedUser, createReview);
router.delete(
	"/review",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	deleteReview,
);
module.exports = router;