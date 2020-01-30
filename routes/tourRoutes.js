const express = require('express');
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    results: tours.length,
    data: {
      tours
    }
  });
};
const getTour = (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    results: tours.length,
    data: {
      tour
    }
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    message: 'Insertion Complete'
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  console.log(req.body);
  const newTour = Object.assign(
    {
      id: newId
    },
    req.body
  );
  tours.push(newTour);
  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        requestedAt: req.requesttime,
        data: {
          tour: newTour
        }
      });
    }
  );
};

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour);

module.exports = router;
