const { query } = require("../db/database");
const fs = require("fs");
const path = require("path");
const { join, dirname } = require("path");
const User = require("./user.model");
class Product {
	constructor(product) {
		this.id = product.id || null;
		this.name = product.name || " ";
		this.price = Number(product.price) || 0.0;
		this.description = product.description || " ";
		this.ratings = product.ratings || 0.0;
		this.category = product.category;
		this.seller = product.seller || "unknown";
		this.stock = product.stock || 0;
		this.numOfRev = product.numOfRev || 0;
		this.images = product.images || [];
		this.reviews = product.reviews || [];
	}

	static async create(product, result) {
		const seeder = new Product(product);
		const sql =
			"INSERT INTO products (name, description, category, price, ratings, seller, stock, numOfRev) VALUES (? , ?, ?, ?, ?, ?, ?, ?)";
		const params = [
			seeder.name,
			seeder.description,
			seeder.category,
			seeder.price,
			0,
			seeder.seller,
			seeder.stock,
			0,
		];

		const res = await query(sql, params);
		const id = res.insertId;
		seeder.id = id;
		result(seeder);
	}
	static async findAll({ orderBy = null, take = 10, skip = 0 }) {
		console.log((">>>>check order: ", orderBy));
		const sql = `SELECT * FROM products ${
			orderBy ? `ORDER BY ${orderBy[0]} ${orderBy[1]}` : ""
		}`;

		const res = await query(sql, []);

		for (let i = 0; i < res.length; i++) {
			const sql = "SELECT * FROM images_product WHERE idProduct = ?";
			const params = [res[i].id];
			res[i].images = await query(sql, params);
		}
		// console.log(res);
		return res;
	}
	static async countDocuments() {
		const sql = "SELECT COUNT(*) FROM products";
		return await query(sql, []);
	}
	static async findById(id) {
		const sql = "SELECT * FROM products WHERE id = ?";
		const prod = (await query(sql, [id]))[0];
		const sql_image = "SELECT * FROM images_product WHERE idProduct = ?";
		const img = await query(sql_image, [id]);
		// const review_sql = "SELECT * FROM reviews WHERE IDproduct = ?";
		// const review = await this.getReviews(id);
		prod.images = [...img];
		// prod.reviews = [...review];
		return new Product(prod);
	}
	static async findByIdAndUpdate(id, product) {
		const sql = "SELECT * FROM products WHERE id = ?";
		const prod = (await query(sql, [id]))[0];

		const updatedProduct = {
			...prod,
			...product,
		};
		const sqlUpdate =
			"UPDATE products SET name = ?, description = ?, category = ?, price = ?, ratings = ?, seller = ? , stock = ?, numOfRev = ? WHERE id = ?";
		const params = [
			updatedProduct.name,
			updatedProduct.description,
			updatedProduct.category,
			updatedProduct.price,
			updatedProduct.ratings,
			updatedProduct.seller,
			updatedProduct.stock,
			updatedProduct.numOfRev,
			updatedProduct.id,
		];
		return await query(sqlUpdate, params);
	}
	static async getReviews({ id, take, skip }) {
		const sqlCount =
			"SELECT COUNT(*) AS total FROM reviews WHERE idProduct = ? ";
		const total = (await query(sqlCount, [id]))[0].total;
		const sql =
			"SELECT * FROM reviews WHERE idProduct = ? ORDER BY id DESC LIMIT ? OFFSET ? ";
		const params = [id, take, skip];
		const reviews = await query(sql, params);
		for (const rev of reviews) {
			const user = await User.findById(rev.idUser);
			rev.user = user;
		}
		return { reviews, total };
	}
	static async deleteReview(id) {
		const sql = "DELETE FROM reviews WHERE id = ?";
		const params = [id];
		return await query(sql, params);
	}

	async getImages() {
		const sql = "SELECT * FROM images_product WHERE idProduct = ?";
		const params = [this.id];
		const res = await query(sql, params);
		return res;
	}

	async addImage(path) {
		const sql = "INSERT INTO images_product (idProduct, path) VALUES(?, ?)";
		const params = [this.id, path];
		return await query(sql, params);
	}

	static async removeImage(id) {
		const curImg = (
			await query("select path from images_product where id= ?", id)
		)[0];

		const filePath = path.join(__dirname, "../uploads", curImg.path);

		if (fs.existsSync(filePath)) {
			// Delete the file
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(err);
					return;
				}

				console.log("File deleted successfully");
			});
		} else {
			console.log("File does not exist");
		}

		const sql = "DELETE FROM images_product WHERE id = ?";
		const params = [id];
		return await query(sql, params);
	}

	async updateReview(idProduct, numOfRevs, ratings) {
		const product = await query(
			"UPDATE products SET numOfRev = ?, ratings = ?  WHERE id = ?",
			[numOfRevs, ratings, idProduct],
		);
	}
	static async deleteProduct(id) {
		const prod = await query("SELECT * FROM products WHERE id = ?", [id]);
		await query("DELETE FROM images_product WHERE idProduct = ?", [id]);
		const sql = "DELETE FROM products WHERE id =?";
		const params = [id];
		await query(sql, params);
		return prod[0];
	}
}
module.exports = Product;
