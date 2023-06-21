const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === "DEVELOPMENT") {
		res.status(err.statusCode).json({
			success: false,
			error: err.stack,
			errMessage: err.message,
			stack: err.stack,
		});
	}

	if (process.env.NODE_ENV === "PRODUCTION") {
		let error = { ...err };

		if (error.name === "CastError") {
			const message = `Resource not found with id of ${error.value}`;
			error = new ErrorHandler(message, 404);
		}

		if (error.name === "ValidationError") {
			const message = Object.values(error.errors).map(
				(val) => val.message,
			);
			error = new ErrorHandler(message, 400);
		}

		if (error.code === 11000) {
			const message = "Duplicate field value entered";
			error = new ErrorHandler(message, 400);
		}

		if (error.name === "JsonWebTokenError") {
			const message = "Invalid token";
			error = new ErrorHandler(message, 401);
		}

		res.status(error.statusCode).json({
			success: false,
			message: error.message || "Internal Server Error",
		});
	}
};
