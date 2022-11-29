const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SIGNATURE);

    const userr = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    })
      .select('-password')
      .select('-tokens');
    console.log(userr);
    if (!userr) {
      throw new Error();
    }
    req.user = userr;
    req.token = token;

    next();
  } catch (e) {
    res.status(401).send(e);
  }
};

module.exports = auth;
