const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB successful'))
  .catch((err) => {
    console.log(err);
  });

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log('DB successful'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('app running on port  ' + port + '...');
});
