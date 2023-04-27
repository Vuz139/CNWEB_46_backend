const mysql = require("mysql2/promise");

require("dotenv").config();

async function query(sql, params) {
	console.log(sql, params || "Không có params");
	const connection = await mysql.createConnection({
		host: process.env.HOST || "localhost",
		user: process.env.USER || "root",
		password: process.env.PASSWORD || "",
		namedPlaceholders: true,
		database: process.env.DATABASE || "cnweb46",
	});
	await connection.connect();
	console.log("connection established");
	const [rows] = await connection.execute(sql, params);
	await connection.end();
	return rows;
}

module.exports = {
	query,
};
