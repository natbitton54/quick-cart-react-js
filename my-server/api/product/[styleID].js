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

    const { styleID } = req.query;

    if (!styleID) {
        return res.status(400).json({ error: 'StyleID is required' });
    }

    sneaks.getProductPrices(styleID, (err, product) => {
        if (err) {
            console.error(`Error fetching product prices for styleID ${styleID}: ${err.message}`);
            return res.status(500).json({ error: `Error fetching product prices for styleID ${styleID}: ${err.message}` });
        }

        res.json(product);
    });
};
