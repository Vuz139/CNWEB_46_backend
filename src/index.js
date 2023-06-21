const express = require("express");
require("express-async-errors");
const middleError = require("./middleWares/errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.static("uploads"));

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(cookieParser());
app.use(cors());
app.get("/", async (req, res) => {
	res.send("Hello World!");
});

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
app.use("/api/v1", authRoute);
app.use("/api/v1", productRoute);
app.use("/api/v1", orderRoute);

app.use(middleError);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
