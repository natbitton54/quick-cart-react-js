const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configure SendGrid API
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
    const { firstName, lastName, email, phone, message } = req.body;

    const msg = {
        to: 'nathanielbitton18@gmail.com', // recipient
        from: process.env.EMAIL_FROM, // verified sender
        subject: "New Message from QuickCart Contact Form",
        html: `
               <h2 style="color: #000">You have a new message from QuickCart</h2>
            <p><strong style="color: #000;">Name:</strong> <span style="color: #888a8a;">${firstName} ${lastName}</span></p>
            <p><strong style="color: #000;">Email:</strong> <span style="color: #888a8a;">${email}</span></p>
            <p><strong style="color: #000;">Phone:</strong> <a href="tel:${phone}" style="color: #888a8a;">${phone}</a></p>
            <p><strong style="color: #000;">Message:</strong></p>
            <p style="color: #888a8a;">${message}</p>
            <hr>
            <p style="color: #888a8a;">This message was sent from the QuickCart contact form.</p>
        `,
    };

    try {
        await sgMail.send(msg);
        res.json({ message: "Email sent successfully" });
    } catch (err) {
        console.error("Error sending email: ", err.response ? err.response.body : err);
        res.status(500).json({ message: "Failed to send email" });
    }
};

module.exports = sendEmail;
