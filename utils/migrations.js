const colors = require("colors");
const { query } = require("../db/database");

function createdUser(opt) {
	const sql = `CREATE TABLE users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL,
        avatar VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS users";
	if (opt === true) {
		query(sql);
		setTimeout(() => createProduct(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => createProduct(opt), 2000);
	}
}

function createProduct(opt) {
	const sql = `CREATE TABLE products (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
        description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ,
        category VARCHAR(255),
        price DECIMAL(10,2),
        ratings DECIMAL(3,2),
        seller VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
        stock INT(11),
        numOfRev INT(11),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS products";

	if (opt === true) {
		query(sql);
		setTimeout(() => createReviews(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => console.log("DELETE success".green), 2000);
	}
}
function createReviews(opt) {
	const sql = `CREATE TABLE reviews (
        id INT(11) NOT NULL AUTO_INCREMENT,
        comment TINYTEXT,
        rating INT(11) NOT NULL,
        idUser INT(11) NOT NULL,
        idProduct INT(11) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (idUser) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (idProduct) REFERENCES products(id) ON DELETE CASCADE
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS reviews";

	if (opt === true) {
		query(sql);
		setTimeout(() => createImageProduct(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => createImageProduct(opt), 2000);
	}
}
function createImageProduct(opt) {
	const sql = `CREATE TABLE images_product (
        id INT(11) NOT NULL AUTO_INCREMENT,
        idProduct INT(11) NOT NULL,
        path VARCHAR(255),
        PRIMARY KEY (id),
        FOREIGN KEY (idProduct) REFERENCES products(id) ON DELETE CASCADE
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS images_product";
	if (opt === true) {
		query(sql);
		setTimeout(() => createShippingInfo(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => createOrder(opt), 2000);
	}
}
function createShippingInfo(opt) {
	const sql = `CREATE TABLE shipping_info (
        id INT(11) NOT NULL AUTO_INCREMENT,
        address VARCHAR(255),
        phoneNo VARCHAR(20) ,
        city VARCHAR(100) ,
        country VARCHAR(100) ,
        postalCode VARCHAR(20),
        PRIMARY KEY (id)
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS shipping_info";

	if (opt === true) {
		query(sql);
		setTimeout(() => createOrder(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => createdUser(opt), 2000);
	}
}
function createOrder(opt) {
	const sql = `CREATE TABLE orders (
        id INT(11) NOT NULL AUTO_INCREMENT,
        idUser INT,
        idShippingInfo INT,
        paymentInfo VARCHAR(255),
        itemsPrice DECIMAL(13, 2),
        taxPrice DECIMAL(13, 2),
        shippingPrice DECIMAL(13, 2),
        totalPrice DECIMAL(13, 2),
        paidAt DATETIME,
        orderStatus VARCHAR(255),
        deliveredAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (idUser) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (idShippingInfo) REFERENCES shipping_info(id) ON DELETE CASCADE
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS orders";

	if (opt === true) {
		query(sql);
		setTimeout(() => createItemOrder(opt), 2000);
	} else {
		query(sqlDown);
		setTimeout(() => createShippingInfo(opt), 2000);
	}
}
function createItemOrder(opt) {
	const sql = `CREATE TABLE itemOrder (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        idProduct INT(11) NOT NULL,
        idOrder INT NOT NULL,
        amount INT UNSIGNED NOT NULL,
        FOREIGN KEY (idProduct) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (idOrder) REFERENCES orders(id) ON DELETE CASCADE
      );
      `;
	const sqlDown = "DROP TABLE IF EXISTS itemOrder";

	if (opt === true) {
		query(sql);
		setTimeout(() => console.log("SUCCESSFULLY".green), 1000);
	} else {
		query(sqlDown);
		setTimeout(() => createReviews(opt), 2000);
	}
}
// create tables
createdUser(true);

// delete tables
// createItemOrder(false);
