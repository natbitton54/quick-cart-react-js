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

    try {
        sneaks.getProducts('shoes', 180, (err, products) => {
            if (err) {
                console.error(`Error fetching products: ${err.message}`);
                return res.status(500).json({ error: `Error fetching products: ${err.message}` });
            }

            const filteredProducts = products.filter(product =>
                ['Adidas', 'Nike', 'New Balance', 'Puma', 'Reebok'].includes(product.brand)
            );

            res.json(filteredProducts);
        });

    } catch (err) {
        console.error(`Server error: ${err.message}`);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
};
