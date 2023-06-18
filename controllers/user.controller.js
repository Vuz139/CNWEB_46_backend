const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

// register a new user => api/v1/user/register
exports.register = async (req, res, next) => {
	const user = new User(req.body);
	try {
		const getUser = new User(await user.save());

		delete user.password;
		sendToken(getUser, 200, res);
	} catch (err) {
		res.status(400).send({
			err: "Not success",
		});
		// next(new ErrorHandler(err.message, err.statusCode));
	}
};

// login a user => api/v1/user/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
	const { email, password } = req.body;
	// check if email and password are entered by user
	if (!email || !password) {
		return next(new ErrorHandler("Please provide email and password", 400));
	}
	// check if user exists
	try {
		const user = await User.findByEmail(email);
		if (!user) {
			return next(new ErrorHandler("Invalid email or password", 401));
		}
		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			return next(new ErrorHandler("Invalid email or password", 401));
		} else {
			delete user.password;
			sendToken(user, 200, res);
		}
	} catch (err) {
		return next(new ErrorHandler("Invalid email or password", 401));
	}
});
// refresh token => api/v1/refresh-token
exports.refreshToken = catchAsyncErrors(async (req, res, next) => {
	const user = req.user;
	console.log(user);
	// check if user exists
	try {
		delete user.password;
		sendToken(user, 200, res);
	} catch (err) {
		return next(new ErrorHandler("Invalid email or password", 401));
	}
});

// add avatar user
exports.updateAvatar = catchAsyncErrors(async (req, res) => {
	const path = req.file.filename;
	req.user.avatar = path;
	res.send(await req.user.update());
});

// // forgot password => api/v1/password/forgot
// exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
// 	// todo
// });

// // reset password => api/v1/password/reset
// exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
// 	// todo
// });

// get current logged in user details => api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		status: "success",
		user,
	});
});

// Update / Change password for current user => api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	const isMatch = await user.comparePassword(req.body.oldPassword);
	if (!isMatch) {
		return next(new ErrorHandler("Invalid email or password", 401));
	}

	user.password = req.body.newPassword;

	await user.update();
	sendToken(user, 200, res);
});

//  update user profile => /api/v1/me/update
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
	const user = new User(req.user);
	// console.log(req.user);

	user.name = req.body.name || user.name;
	user.email = req.body.email || user.email;

	await user.update();

	res.status(200).json({
		status: "success",
		user,
	});
});

// admin routers
//  get all users => api/v1/admin/users
exports.getUsers = catchAsyncErrors(async (req, res) => {
	try {
		const { take, skip, keyword, orderBy } = req.query;
		const order = orderBy && orderBy.split(",");
		const users = await User.find({
			take,
			skip,
			keyword,
			orderBy: orderBy && order,
		});
		const total = await User.count();
		res.status(200).send({
			status: "success",
			total,
			take: req.query.take || 10,
			skip: req.query.skip || 0,

			users,
		});
	} catch (error) {
		res.send({ message: error.message });
	}
});

// get user by id => api/v1/admin/user/:id
exports.getUserById = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	res.status(200).json({
		status: "success",
		user,
	});
});

// delete user by id => api/v1/admin/user/:id
exports.deleteUserById = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(new ErrorHandler("User not found", 404));
	}

	const rs = await user.remove();

	res.status(200).json({
		status: "success",
		message: "User deleted successfully",
		user: rs,
	});
});

// update user => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	user.name = req.body.name || user.name;
	user.email = req.body.email || user.email;
	user.role = req.body.role || user.role;

	// avatar todo
	user.update();

	res.status(200).json({
		status: "success",
		user,
	});
});
