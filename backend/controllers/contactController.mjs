import nodemailer from 'nodemailer';
import * as utils from '../utils/utils.mjs';
import * as contacts from '../models/Contact.mjs';


// CREATE Contact
const createContact = (req, res) => { 
    const name = req.body.name;
    const email = req.body.email;
    const concernType = req.body.concernType;
    const concernDetails = req.body.concernDetails;
    const referrer = req.body.referrer;
    const recommend = req.body.recommend;

    const referrerRes = referrer.length === 1 ? `${referrer[0]}` : referrer.length === 2 ? `${referrer[0]} and ${referrer[1]}` : `${referrer[0]}, ${referrer[1]} and ${referrer[2]}`

    contacts.createContact(name, email, concernType, concernDetails, referrer, recommend)
        .then(contact => {
            res.status(201).json(contact);

            async function processEmail() {
                // Generate test SMTP service account from ethereal.email
                 // Only needed if you don't have a real mail account for testing
                let testAccount = await nodemailer.createTestAccount();
        
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  host: "smtp.ethereal.email",
                  port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass, 
                    }, 
                });
            
                // send mail with defined transport object
                let info = await transporter.sendMail({
                  from: `${name}, <${testAccount.email}>`, // sender address
                  to: `${email}`, // list of receivers
                  subject: "Thank you for the feedback...", // Subject line
                  html: utils.emailForm(name, email, concernType, concernDetails, referrerRes, recommend), // html body
                });
            
                console.log("Message sent: %s", info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            }

            processEmail();
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: "Whoops, something went wrong with sending the contact information... Please try again!" });
        });
};


export { createContact };