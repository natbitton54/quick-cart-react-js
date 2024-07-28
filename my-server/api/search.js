const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
const { toast } = require('react-toastify');

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

    const { query } = req.query;
    const allowedBrands = ['nike', 'puma', 'new balance', 'adidas', 'reebok'];

    if (!allowedBrands.includes(query.toLowerCase())) {
        return res.status(400).json({ error: 'Search is restricted to the following brands: Nike, Puma, New Balance, Adidas, and Reebok.' });
    }

    try {
        sneaks.getProducts(query, 50, (err, products) => {
            if (err) {
                console.error(`Error searching products: ${err.message}`);
                return res.status(500).json({ error: `Error searching products: ${err.message}` });
            }

            res.json(products);
        });
    } catch (err) {
        console.error(`Server error: ${err.message}`);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};
