const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
        user: 'nikolai1234509@mail.ru',
        pass: 'A4zE1WW3zFqBmfTrNRF3'
    }
});

const mailer = message => {
    transporter.sendMail(message, function (err, response) {
        if (err) console.log(err);
        else console.log("Message sent: ", response.message);
    })
};

module.exports = mailer