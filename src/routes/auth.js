const express = require("express");

const router = express.Router();

const {
	register,
	loginUser,
	getUserProfile,
	updatePassword,
	updateUserProfile,
	refreshToken,
	getUsers,
	getUserById,
	deleteUserById,
	updateAvatar,
	updateUser,
} = require("../controllers/user.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleWares/auth");
const { upload } = require("../middleWares/multer.config");

router.post("/user/register", register);
router.post(
	"/user/avatar",
	isAuthenticatedUser,
	upload.single("file"),
	updateAvatar,
);
router.post("/user/login", loginUser);
router.get("/refresh-token", isAuthenticatedUser, refreshToken);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.post("/me/update", isAuthenticatedUser, updateUserProfile);

router.get(
	"/admin/users",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	getUsers,
);
router.get(
	"/admin/user/:id",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	getUserById,
);

router.delete(
	"/admin/user/:id",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	deleteUserById,
);
router.put(
	"/admin/user/:id",
	isAuthenticatedUser,
	authorizeRoles("admin"),
	updateUser,
);

module.exports = router;
