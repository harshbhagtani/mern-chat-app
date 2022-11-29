const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email provided is not a email');
        }
      }
    },
    password: { type: String, required: true },
    userpic: {
      type: String,
      required: true,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
    },
    tokens: [
      {
        token: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateToken = async function (email, password) {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SIGNATURE
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.getuserByEmailPassword = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to Login');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to Login');
  }

  return user;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
