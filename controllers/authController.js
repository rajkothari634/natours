const User = require('./../models/userModel');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendEmail = require('./../utils/email');

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
  try {
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
      return;
    }
    //verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      res.status(400).json({
        status: 'fail',
        message: 'user not found',
      });
      return;
    }
    if (freshUser.changePasswordAfter(decoded.iat)) {
      res.status(400).json({
        status: 'fail',
        message: 'password is changed',
      });
      return;
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  } catch (err) {}
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ['admin','lead-guide']
    if (!roles.includes(req.user.role)) {
      res.status(400).json({
        status: 'fail',
        message: 'u cant delete tour',
      });
      return;
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  try {
    console.log('forgot');
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({
        status: 'fail',
        message: 'user not found',
      });
      return;
    }
    const resetToken = user.createPasswordResetToken();
    console.log('forgot' + resetToken);
    await user.save({
      validateBeforeSave: false,
    });
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    const message = `forget ur password ? submit a PATCH request with your new password and passwordConfirm to ${resetURL}`;
    console.log('forget' + 'nmay be');
    const result = await sendEmail({
      email: user.email,
      subject: 'your Password reset token (valid for 10 min)',
      message,
    });
    console.log(result);
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    return;
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    return;
  }
};
