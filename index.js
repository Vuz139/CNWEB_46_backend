const express = require("express");
const { query } = require("./db/database");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.get("/", async (req, res) => {
	const row = await query();
	res.send("Hello World!");
});
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
