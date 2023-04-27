const { query } = require("../db/database");

function createdUser() {
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
	query(sql);
}

function createProduct() {
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
	query(sql);
}
function createReviews() {
	const sql = `CREATE TABLE reviews (
        id INT(11) NOT NULL AUTO_INCREMENT,
        comment TINYTEXT,
        rating INT(11) NOT NULL,
        idUser INT(11) NOT NULL,
        idProduct INT(11) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (idUser) REFERENCES users(id),
        FOREIGN KEY (idProduct) REFERENCES products(id)
      );
      `;
	quedry(sql);
}
function createImageProduct() {
	const sql = `CREATE TABLE images_product (
        id INT(11) NOT NULL AUTO_INCREMENT,
        idProduct INT(11) NOT NULL,
        path VARCHAR(255),
        PRIMARY KEY (id),
        FOREIGN KEY (idProduct) REFERENCES products(id)
      );
      `;
	query(sql);
}
function createShippingInfo() {
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
	query(sql);
}
function createOrder() {
	const sql = `CREATE TABLE orders (
        id INT NOT NULL AUTO_INCREMENT,
        idUser INT,
        idShippingInfo INT,
        paymentInfo ENUM('pending', 'fullfiled'),
        itemsPrice DECIMAL(13, 2),
        taxPrice DECIMAL(13, 2),
        shippingPrice DECIMAL(13, 2),
        totalPrice DECIMAL(13, 2),
        paidAt DATETIME,
        orderStatus ENUM('pending', 'processing', 'fullfiled'),
        deliveredAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (idUser) REFERENCES users(id),
        FOREIGN KEY (idShippingInfo) REFERENCES shipping_info(id)
      );
      `;
	query(sql);
}
function createItemOrder() {
	const sql = `CREATE TABLE itemOrder (
        id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        idProduct INT(11) NOT NULL,
        idOrder INT NOT NULL,
        amount INT UNSIGNED NOT NULL,
        FOREIGN KEY (idProduct) REFERENCES products(id),
        FOREIGN KEY (idOrder) REFERENCES orders(id)
      );
      `;
	query(sql);
}
// createItemOrder();
// // createShippingInfo();
// // createOrder();
// // createImageProduct();
// // createReviews();
// // createdUser();
// // createProduct();
