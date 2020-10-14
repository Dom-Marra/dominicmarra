import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';


export const sendEmail = functions.https.onRequest((request, response) => {
    const cors = require('cors')({origin: true});

    cors(request, response, () => {
        const gmailEmail = 'dominicmarra321@gmail.com';
        const gmailPassword = functions.config().emailservice.secretpassword;
        let content = JSON.parse(request.body);

        const mailTransport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailEmail,
                pass: gmailPassword,
            },
        });

        if (!content.hasOwnProperty('email') || !content.hasOwnProperty('subject') || !content.hasOwnProperty('description')) {
            response.status(500).send(false);
        }

        const mailOptions: nodemailer.SendMailOptions = {
            to: gmailEmail,
            subject: content['subject'],
            text: 'From: ' + content['email'] + '\n\n' + content['description']
        };

        mailTransport.sendMail(mailOptions).then(() => {
            response.status(200).send(true);
        }).catch(() => {
            response.status(500).send(false);
        });
    });
    
});
