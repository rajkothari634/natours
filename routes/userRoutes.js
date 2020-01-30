const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is not define'
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is not define'
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is not define'
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this is not define'
  });
};
const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser);

module.exports = router;
