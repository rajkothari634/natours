const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  console.log('working ' + 'one');
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log('working ' + 'two');
  const mailOptions = {
    from: 'rkmeansrk39@gmail.com',
    to: options.email,
    subject: options.email,
    text: options.messsage,
  };
  await transporter.sendMail(mailOptions);
  console.log('working ' + 'three');
};

module.exports = sendEmail;
