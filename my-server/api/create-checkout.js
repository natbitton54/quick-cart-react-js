const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function generateOrderNumber() {
    return `QC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://quick-cart-react-js.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { items } = req.body;

    const line_items = items.map(item => ({
        price_data: {
            currency: 'cad',
            product_data: {
                name: item.shoeName,
                images: [item.thumbnail],
            },
            unit_amount: Math.round(item.lowestResellPrice.stockX * 100),
        },
        quantity: item.quantity,
        tax_rates: ['txr_1PdUa9Hj3F6BHA9pegG0gnaK']
    }));

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const success_url = `${protocol}://${host}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${protocol}://${host}/cart`;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna', 'affirm'],
            line_items,
            mode: 'payment',
            success_url,
            cancel_url,
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0,
                            currency: 'cad',
                        },
                        display_name: 'Free shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 1500,
                            currency: 'cad',
                        },
                        display_name: 'Standard shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 3,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 5,
                            },
                        },
                    },
                },
            ],
            metadata: {
                order_number: generateOrderNumber(),
                brand_name: 'QuickCart'
            },
            custom_text: {
                shipping_address: {
                    message: 'Quebec Sales Tax (14.975%) applies to this order.'
                },
                submit: {
                    message: 'By completing this purchase, you agree to the terms and conditions, including the Quebec Sales Tax of 14.975%.'
                }
            }
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error('Stripe API error:', err);
        res.status(500).json({ error: err.raw ? err.raw.message : 'Internal Server Error' });
    }
};
