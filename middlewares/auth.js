const jwt = require("jsonwebtoken");

const newLocal = "./catchAsyncErrors";
const catchErrors = require(newLocal);
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/user.model");

// check if user is authenticated or not
exports.isAuthenticatedUser = catchErrors(async (req, res, next) => {
	const token =
		req.rawHeaders[req.rawHeaders.indexOf("Authorization") + 1].split(
			" ",
		)[1];
	if (!token) {
		return next(
			new ErrorHandler("Login first to access this resource.", 401),
		);
	}
	console.log("token", token);

	// get userId by token
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	} catch (err) {
		console.log(err);
		res.send(err);
	}
});

// Handling users roles
exports.authorizeRoles = (...roles) =>
	catchErrors(async (req, res, next) => {
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
