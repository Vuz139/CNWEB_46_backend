const multer = require("multer");
const path = require("path");

// Create a storage instance with the desired configuration
const storage = multer.diskStorage({
	destination: path.join(path.dirname(__dirname), "uploads/"), // Specify the destination folder
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		// Use the original name of the uploaded file along with a unique suffix
		const fileName =
			file.fieldname +
			"-" +
			uniqueSuffix +
			path.extname(file.originalname);
		cb(null, fileName);
	},
});

// Create the Multer instance using the storage configuration
const upload = multer({ storage: storage });

module.exports = { upload };
