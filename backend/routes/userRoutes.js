const express = require('express');
const auth = require('../middlwares/auth');
const {
  fetchAllUsers,
  userSignUp,
  userLogin,
  fetchMyProfile
} = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, fetchAllUsers);
router.get('/me', auth, fetchMyProfile);
router.post('/signup', userSignUp);
router.post('/login', userLogin);

module.exports = router;
