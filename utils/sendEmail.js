const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    auth: {
      user: process.env.SMPT_USER,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: "studentservee@gmail.com",
    to: options.email,
    subject: "Passowrd Recovery",
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
