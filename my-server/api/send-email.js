const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quick-cart-react-js.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    if (req.method === 'POST') {
        const { firstName, lastName, email, phone, message } = req.body;

        const msg = {
            to: 'nathanielbitton18@gmail.com',
            from: process.env.EMAIL_FROM,
            subject: 'New Message from QuickCart Contact Form',
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
            res.status(200).json({ message: 'Email sent successfully' });
        } catch (err) {
            console.error('Error sending email: ', err);
            res.status(500).json({ message: 'Failed to send email', details: err.toString() });
        }
    } else {
        res.status(500).json({ error: 'Method Not Allowed' });
    }
};
