const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quick-cart-react-js.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const limit = 5;

    try {
        sneaks.getMostPopular(limit, (err, products) => {
            if (err) {
                console.error(`Error fetching most popular products: ${err.message}`);
                return res.status(500).json({ error: `Error fetching most popular products: ${err.message}` });
            }

            res.json(products);
        });
    } catch (err) {
        console.error(`Server error: ${err.message}`);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};
