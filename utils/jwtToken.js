//  create and send token and save in the cookie

const sendToken = (user, statusCode, res) => {
	// create Jwt token
	const token = user.getJwtToken();

	// Options for cookie
	// const options = {
	// 	expires: new Date(
	// 		Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
	// 	),
	// 	httpOnly: true,
	// };

	res.status(statusCode).json({
		success: true,
		user,
		token,
	});
};

module.exports = sendToken;
