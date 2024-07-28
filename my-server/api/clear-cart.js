module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quick-cart-react-js.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
};
