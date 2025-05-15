var http = require('http');
var nodemailer = require('nodemailer');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url === '/send-email' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const email = JSON.parse(body).email;
            sendEmail(email);
            res.end('Email sent to ' + email);
        });
    } else {
        res.end('Welcome to the server!');
    }
}).listen(8080);

console.log("Server is running at http://localhost:8080/");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'esteban.bare@laplateforme.io',
        pass: 'bsoljvsbxqktdsal'
    }
});

// Function to send an email

function sendEmail(email) {
    const mailOptions = {
        from: 'esteban.bare@laplateforme.io',
        to: email,
        subject: 'Welcome to LaPlateforme',
        text: 'Hello, welcome to LaPlateforme! We are glad to have you here.'
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}