const mysql = require("mysql2/promise");
const colors = require("colors");
require("dotenv").config();

async function query(sql, params) {
	console.log(sql.green, (params || "Không có params").green);

	const connection = await mysql.createConnection({
		host: process.env.HOST || "localhost",
		user: process.env.USER || "root",
		password: process.env.PASSWORD || "",
		namedPlaceholders: true,
		database: process.env.DATABASE || "cnweb46",
	});
	await connection.connect();

	console.log("connection established".green);
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
