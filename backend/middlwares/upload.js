const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url,
  options: { useNewUrlParser: true },
  file: (request, file) => {
    const match = ['image/png', 'image/jpg'];

    console.log(file);

    if (match.indexOf(file.mimeType) === -1)
      return `${Date.now()}-blog-${file.originalname}`;

    return {
      bucketName: 'photos',
      filename: `${Date.now()}-blog-${file.originalname}`
    };
  }
});
const upload = multer({ storage });

module.exports = {
  upload
};
