const express = require('express');
const {
  accesschat,
  fetchchats,
  createGroupChat,
  renameGroup,
  fetchIndividualChat
} = require('../controllers/chatController');
const auth = require('../middlwares/auth');

const router = express.Router();

router.post('/', auth, accesschat);
router.get('/', auth, fetchchats);
router.post('/group', auth, createGroupChat);
router.patch('/rename', auth, renameGroup);
router.get('/:chatId', auth, fetchIndividualChat);
// router.post('/groupadd', auth, addMember);
// router.post('/groupRemove', auth, removeMember);

module.exports = router;
