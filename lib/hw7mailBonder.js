const { Publisher } = require('./Publisher.js');
const nodemailer = require('nodemailer');

class MailBonder {
    #value = 0; //final message from cancellation stored here

    //subscriber's email
    constructor(email) {
        this.email = email;
    }

    get value() {
        return this.#value;
    }

    //bind calculation to event sources
    //store value, and return the source publisher
    bind(source, calculation) {
        let self = this;
        let sendEmail = this.email;
        
        source.subscribe(function(eventProperties) {
            let text = calculation(eventProperties);
            console.log(text);
            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                port: 587,
                auth: {
                user: 'realmrpizza285@gmail.com',
                pass: 'cmcd hgju nekz drqj'
                },
                secure: false,
                tls: {
                    ciphers: 'SSLv3',
                    rejectUnauthorized: false,
                }
            });
    
            var mailOptions = {
                from: 'realmrpizza285@gmail.com',
                to: sendEmail,
                subject: 'Cancellation of Event Confirmation!',
                text: text
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.writeHead(400, {'Content-type': 'text/plain'})
                    res.end("Error: Email is not valid.")
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            
            transporter.close();
        });

        return source; //returns the source publisher (better than NULL...)
    }
}

module.exports = {
    MailBonder
}