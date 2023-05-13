const jwt = require("jsonwebtoken");

const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user.model");

// check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(
			new ErrorHandler("Login first to access this resource.", 401),
		);
	}
	// get userId by token
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = await User.findById(decoded.id);
	next();
});

// Handling users roles
exports.authorizeRoles = (...roles) =>
	catchAsyncErrors(async (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorHandler(
					"You are not authorized to access this resource.",
					403,
				),
			);
		}
		next();
	});
