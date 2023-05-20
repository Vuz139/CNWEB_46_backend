const mysql = require("mysql2/promise");
const colors = require("colors");
require("dotenv").config();

// const pool = mysql.createPool({
// 	host: process.env.HOST || "localhost",
// 	user: process.env.USER || "root",
// 	password: process.env.PASSWORD || "",
// 	namedPlaceholders: true,
// 	database: process.env.DATABASE || "cnweb46",
// 	waitForConnections: true,
// 	connectionLimit: 10,
// 	queueLimit: 0,
// });

async function query(sql, params) {
	console.log(sql.green, params || "Không có params");

	const connection = await mysql.createConnection({
		host: process.env.HOST || "localhost",
		user: process.env.USER || "root",
		password: process.env.PASSWORD || "",
		namedPlaceholders: true,
		database: process.env.DATABASE || "cnweb46",
	});
	await connection.connect();

	console.log("\nconnection established\n".green);
	try {
		const [rows] = await connection.execute(sql, params);
		return rows;
	} catch (err) {
		console.log(err);
	} finally {
		await connection.end();
	}
}

module.exports = {
	query,
};
