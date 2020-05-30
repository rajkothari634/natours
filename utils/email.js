const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'raj kothari <rkmeansrk39@gmail.com>',
    to: options.email,
    subject: options.email,
    text: options.messsage,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
