const express = require("express");
require("express-async-errors");
const middleError = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(cookieParser());

app.get("/", async (req, res) => {
	res.send("Hello World!");
});

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
app.use("/api/v1", authRoute);
app.use("/api/v1", productRoute);

app.use(middleError);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
