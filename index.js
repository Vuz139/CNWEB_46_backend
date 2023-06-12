const express = require("express");
require("express-async-errors");
const middleError = require("./middlewares/errors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

const products = [
	{ id: 1, name: 'Product 1' },
	{ id: 2, name: 'Product 2' },
	{ id: 3, name: 'Product 3' },
	{ id: 4, name: 'Product 4' }
  ];
  
  // Định nghĩa route API để lấy 4 sản phẩm
app.get('/api/products', (req, res) => {
	const fourProducts = products.slice(0, 4);
	res.json(fourProducts);
  });
  
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
