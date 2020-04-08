const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordconfirm: req.body.passwordconfirm,
    });
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'not created\n' + err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // email and password is sent or not
    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'provide email and password',
      });
      return;
    }
    //email and password is correct
    const user = await (await User.findOne({ email })).isSelected('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      res.status(400).json({
        status: 'fail',
        message: 'invalid email or password',
      });
      return;
    }

    // If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'error',
    });
  }
};

exports.protect = async (req, res, next) => {
  // getting token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    res.status(400).json({
      status: 'fail',
      message: 'give token',
    });
  }
  //verification of token
  jwt.verify();
};
