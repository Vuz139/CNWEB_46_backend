const { query } = require("../db/database");

class Product {
	constructor(product) {
		this.id = product.id || null;
		this.name = product.name || " ";
		this.price = Number(product.price) || 0.0;
		this.description = product.description || " ";
		this.ratings = product.ratings || 0.0;
		this.images = product.images || [];
		this.category = product.category;
		this.seller = product.seller || "unknown";
		this.stock = product.stock || 0;
		this.numOfReviews = product.numOfReviews || 0;
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
		return await query(sql, []);
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
		// let _product = new Product(product);
		// const currProd = await query('SELECT * FROM products WHERE id = ?', [id]);
		// console.log(currProd[0]);
		if (product.images) {
			for (const image of product.images) {
				const imageSql =
					"INSERT INTO images_product (idProduct, path) VALUES (?,?)";
				const imageParams = [id, image.url];
				await query(imageSql, imageParams);
			}
			delete product.images;
		}

		// console.log(product);

		let sql = "UPDATE products SET ";
		let params = [];

		for (const key in product) {
			// if(key == 'image' || key == 'reviews') continue;
			// sql += '? = ? , ';
			sql += ` ${key} = "${product[key]}" , `;
			params.push(key, product[key]);
		}

		sql = sql.substring(0, sql.length - 2);
		sql += ` WHERE id = ${id}`;
		params.push(id);
		// console.log(sql);
		// const sql = 'UPDATE products SET name =?, description =?, category =?, price =?, ratings =?, seller =?, stock =?, numOfRev =? WHERE id =?';
		// const params = [_product.name, _product.description, _product.category, _product.price, _product.ratings, _product.seller, _product.stock, _product.numOfReviews, id];

		await query(sql, []);
		const prods = await query("SELECT * FROM products WHERE id = ?", [id]);
		return prods[0];
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
