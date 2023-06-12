const { query } = require("../db/database");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const ErrorHandler = require("../utils/errorHandler");

class User {
	constructor(user) {
		this.id = user.id || null;
		this.name = user.name || null;
		this.email = user.email || "";
		this.password = user.password || null;
		this.role = user.role || "user";
		this.avatar = user.avatar || null;
	}

	async update() {
		const currProile = (
			await query("SELECT * FROM users WHERE id = ? ", [this.id])
		)[0];

		if (this.password.length < 36) {
			// đổi mật khẩu
			const sql = "UPDATE users SET password = ? WHERE id = ?";
			this.password = await bcrypt.hash(this.password, 10);
			const params = [this.password, this.id];
			const res = await query(sql, params);
			return res;
		} else {
			// cập nhật email, name, ...

			const sql =
				"UPDATE users SET name =?, email =?, role = ?, avatar = ? WHERE id =?";
			const params = [
				this.name || currProile.name,
				this.email || currProile.email,
				this.role,
				this.avatar || currProile.avatar,
				this.id,
			];
			const res = await query(sql, params);
			return res;
		}
	}

	async save() {
		if (!this.name || !this.email || !this.password) {
			throw new ErrorHandler(
				"Name, email, and password are required.",
				400,
			);
		}
		if (this.name.length > 40) {
			throw new ErrorHandler("Name is too long.", 400);
		}
		// if (this.password.length > 30 || this.password.length < 6) {
		// 	throw new ErrorHandler("Password is too long or too short.", 400);
		// }
		if (!/\S+@\S+\.\S+/.test(this.email)) {
			throw new ErrorHandler("Email is not valid.", 400);
		}
		const checkExist = await query("SELECT * FROM users WHERE email = ?", [
			this.email,
		]);
		if (checkExist.length > 0) {
			throw new ErrorHandler("Email is already in use.", 400);
		}
		try {
			this.password = await bcrypt.hash(this.password, 10);
			const res = await query(
				"INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)",
				[this.name, this.email, this.password, this.role, this.avatar],
			);

			return (
				await query("SELECT * FROM users WHERE id = ? ", [res.insertId])
			)[0];
		} catch (err) {
			console.log(err);
		}
	}

	static async findByEmail(email) {
		const sql = "SELECT * FROM users WHERE email = ?";
		const params = [email];
		const res = await query(sql, params);

		if (res.length > 0) {
			return new User(res[0]);
		} else throw new ErrorHandler("User not found", 400);
	}
	static async findById(id) {
		const sql = "SELECT * FROM users WHERE id =?";
		const params = [id];
		const res = await query(sql, params);
		if (res.length > 0) {
			return new User(res[0]);
		} else throw new ErrorHandler("User not found", 400);
	}
	static async count() {
		const sql = "SELECT count(*) AS total FROM users ";
		return (await query(sql, []))[0].total;
	}
	static async find({
		take = 10,
		skip = 0,
		orderBy = ["id", "desc"],
		keyword = "",
	}) {
		const search = `%${keyword.trim().replace(/ +/g, "%")}%`;
		console.log(">>>search: ", search);
		const sql = `SELECT * FROM users
					WHERE (role LIKE ? OR name LIKE ?)
					ORDER BY ${orderBy[0]} ${orderBy[1]} 
					LIMIT ? OFFSET ? 
				
					`;
		const params = [search, search, take, skip];
		const res = await query(sql, params);

		return res;
	}

	async remove() {
		const sql = "DELETE FROM users WHERE id =?";
		const params = [this.id];
		await query(sql, params);
		return this;
	}

	async comparePassword(password) {
		return await bcrypt.compare(password, this.password);
	}

	getJwtToken() {
		return jwt.sign({ id: this.id }, process.env.JWT_SECRET || "abcdef", {
			expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		});
	}
}

module.exports = User;
