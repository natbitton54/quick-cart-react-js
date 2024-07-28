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

    const { brand } = req.query;

    if (!brand) {
        return res.status(400).json({ error: 'Brand is required' });
    }

    try {
        sneaks.getProducts(brand, 100, (err, products) => {
            if (err) {
                console.error(`Error fetching highest resale products for brand ${brand}: ${err.message}`);
                return res.status(500).json({ error: `Error fetching highest resale products for brand ${brand}: ${err.message}` });
            }

            const sortedProducts = products.sort((a, b) => {
                return (b.lowestResellPrice?.stockX || 0) - (a.lowestResellPrice?.stockX || 0);
            });

            const highestResaleProducts = sortedProducts.slice(2, 30);
            res.json(highestResaleProducts);
        });
    } catch (err) {
        console.error(`Server error: ${err.message}`);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};
