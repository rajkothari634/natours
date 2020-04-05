const fs = require('fs');

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

exports.checkID = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length)
    return res.status(400).json({
      status: 'fail',
      message: 'invalid ID'
    });
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
    console.log('dffdf');
  }
  next();
};
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    results: tours.length,
    data: {
      tours
    }
  });
};
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    results: tours.length,
    data: {
      tour
    }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requesttime,
    message: 'Insertion Complete'
  });
};

exports.createTour = (req, res) => {
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
