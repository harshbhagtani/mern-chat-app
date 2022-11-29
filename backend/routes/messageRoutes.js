const express = require('express');

const {
  getAllMessages,
  sendMessage,
  uploadFile,
  getFile
} = require('../controllers/messageController');
const auth = require('../middlwares/auth');
const { upload } = require('../middlwares/upload');

const router = express.Router();

router.get('/:chatId', auth, getAllMessages);
router.post('/', auth, sendMessage);
router.post('/uploadfile', auth, upload.single('file'), uploadFile);
router.get('/file/:fileName', getFile);

module.exports = router;
