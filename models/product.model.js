const { query } = require("../db/database");
const fs = require("fs");
const path = require("path");
const { join, dirname } = require("path");
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
		this.numOfReviews = product.numOfReviews || 0;
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
			seeder.ratings,
			seeder.seller,
			seeder.stock,
			seeder.numOfReviews,
		];

		const res = await query(sql, params);
		const id = res.insertId;

		if (seeder.images.length > 0) {
			for (const image of seeder.images) {
				const imageSql =
					"INSERT INTO images_product (idProduct, path) VALUES (?, ?)";
				const imageParams = [id, image.url];
				await query(imageSql, imageParams);
			}
		}
		seeder.id = id;
		result(seeder);
	}
	static async findAll() {
		const sql = "SELECT * FROM products";
		const res = await query(sql, []);
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
		const review_sql = "SELECT * FROM reviews WHERE IDproduct = ?";
		const review = await query(review_sql, [id]);
		prod.images = [...img];
		prod.reviews = [...review];

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
	static async getReviews(id) {
		const sql = "SELECT * FROM reviews WHERE idProduct = ?";
		const params = [id];
		const reviews = await query(sql, params);
		return reviews;
	}
	static async deleteReview(id) {
		const sql = "DELETE FROM reviews WHERE id =?";
		const params = [id];
		return await query(sql, params);
	}

	async getImages() {
		const sql = "SELECT * FROM images_product WHERE idProduct = ?";
		const params = [this.id];
		const res = await query(sql, params);
		const imgs = res.map((img) => {
			const newPath = join(dirname(__dirname), "uploads/", img.path);

			return {
				...img,
				path: newPath,
			};
		});
		return imgs;
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

		const sql = "DELETE FROm images_product WHERE id = ?";
		const params = [id];
		return await query(sql, params);
	}

	async updateReview(idProduct, review, numOfRevs, ratings) {
		const product = await query(
			"UPDATE products SET numOfRev = ?, ratings = ?  WHERE id = ?",
			[numOfRevs, ratings, idProduct],
		);

		if (!review) return product;
		const revInDB = await query(
			"SELECT * FROM reviews WHERE idProduct = ? AND idUser = ? ",
			[idProduct, review.userId],
		);
		if (revInDB.length > 0) {
			const sql =
				"UPDATE reviews SET comment = ? AND rating = ?  WHERE idProduct =? AND idUser = ?";
			const params = [
				review.comment,
				review.rating,
				idProduct,
				review.userId,
			];
			return await query(sql, params);
		} else {
			const sql =
				"INSERT INTO reviews (idProduct, idUser, comment, rating) VALUES (?,?, ?, ?)";
			const params = [
				idProduct,
				review.userId,
				review.comment,
				review.rating,
			];
			return await query(sql, params);
		}
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
