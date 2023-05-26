const mysql = require("mysql2/promise");
const colors = require("colors");
require("dotenv").config();

const connectInfo = {
	host: process.env.HOST || "localhost",
	user: process.env.USER || "root",
	password: process.env.PASSWORD || "",
	database: process.env.DATABASE || "cnweb46",
	connectionLimit: 10, //mysql connection pool length
};

var dbconnection = mysql.createPool(connectInfo);

// Attempt to catch disconnects
dbconnection.on("connection", function (connection) {
	console.log("DB Connection established");

	connection.on("error", function (err) {
		console.error(new Date(), "MySQL error", err.code);
	});
	connection.on("close", function (err) {
		console.error(new Date(), "MySQL close", err);
	});
});

async function query(sql, params) {
	console.log(sql.green, params || "");
	try {
		const [row] = await dbconnection.execute(sql, params);
		return row;
	} catch (error) {
		console.log(error);
		throw error;
	}

	// const connection = await mysql.createConnection({
	// 	...connectInfo,
	// 	namedPlaceholders: true,
	// });
	// await connection.connect();

	// console.log("\nconnection established\n".green);
	// try {
	// 	const [rows] = await connection.execute(sql, params);
	// 	return rows;
	// } catch (err) {
	// 	console.log(err);
	// 	throw err;
	// } finally {
	// 	await connection.end();
	// }
}

module.exports = {
	query,
};
