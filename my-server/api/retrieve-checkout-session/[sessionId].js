const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quick-cart-react-js.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const sessionId = req.query.sessionId;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        let delivery = 'N/A';

        if (session.total_details && session.total_details.amount_shipping > 0) {
            delivery = '3-5 business days';
        } else {
            delivery = '5-7 business days';
        }

        res.json({
            orderNumber: session.metadata.order_number,
            totalAmount: session.amount_total / 100,
            delivery: delivery
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve session", error: error.message });
    }
};
