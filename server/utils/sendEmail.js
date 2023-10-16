const config = require('./config');
const nodemailer = require('nodemailer');

// async..await is not allowed in global scope, must use a wrapper
  const  sendMail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: config.smtp_host,
        port: config.smtp_port,
        auth: {
          user: config.smtp_email,
          pass: config.smtp_password,
        }
      });
    // send mail with defined transport object
    const message = {
      from: `${config.from_name} <${config.from_email}>`, // sender address
      to: options.email, // list of receivers
      subject: options.text, // Subject line
      text: options.message, // plain text body
    }

    const info = await transporter.sendMail(message);

  
    console.log("Message sent: %s", info.messageId);

  }

module.exports = sendMail;