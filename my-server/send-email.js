require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Configure SendGrid API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    const msg = {
        to: 'nathanielbitton18@gmail.com', // recipient
        from: process.env.EMAIL_FROM, // verified sender
        subject: "New Message from QuickCart Contact Form",
        html: `
            <h2>You have a new message from QuickCart</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p>This message was sent from the QuickCart contact form.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        res.json({ message: "Email sent successfully" });
    } catch (err) {
        console.error("Error sending email: ", err);
        res.status(500).json({ message: "Failed to send email" });
    }
};

module.exports = sendEmail;