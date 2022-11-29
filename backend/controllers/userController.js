const User = require('../models/users');

const fetchMyProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};

//fetch all users with a query param search
const fetchAllUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    console.log(req.user._id);
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
};

//user signup

const userSignUp = async (req, res) => {
  try {
    const user = new User({ ...req.body });
    await user.save();

    const token = user.generateToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

//user login

const userLogin = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const user = await User.getuserByEmailPassword(email, password);

    const token = await user.generateToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports = {
  fetchAllUsers,
  userLogin,
  userSignUp,
  fetchMyProfile
};
