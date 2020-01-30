const express = require('express');
const app = express();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
app.use(express.json());

//middleware
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('console');
  req.requesttime = new Date().toISOString();
  next();
});

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'hello from server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('post method is running');
// });
//route handler

//route

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
//start server
const port = 3000;
app.listen(port, () => {
  console.log('app running on port  ' + port + '...');
});
