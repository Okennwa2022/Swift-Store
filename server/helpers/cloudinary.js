const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
cloud_name: "dpg5u4ym0",
api_key: "873266931435989",
api_secret: "u5fbfjHuD98h41XokUZERioIBGc",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
const result = await cloudinary.uploader.upload(file, {
resource_type: "auto",
});

return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };