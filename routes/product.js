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
	removeImage,
	getImages,
	getProductTop,
} = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleWares/auth");
const { upload } = require("../middleWares/multer.config");

router.post("/product", create_product);
router.get("/products", getProducts);
router.get("/product/max", getProductTop);
router.get("/product/:id", getSingleProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

router.post("/product/image", upload.single("file"), add_image);
router.get("/product/:id/image/", getImages);
router.delete("/product/image/:id", removeImage);

router.get("/reviews/:id", isAuthenticatedUser, getReviews);
router.post("/review", isAuthenticatedUser, createReview);
router.delete(
	"/review",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	deleteReview,
);
module.exports = router;
