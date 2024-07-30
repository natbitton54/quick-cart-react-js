const express = require('express')
const cors = require('cors')
const sendEmail = require('./send-email')
const SneaksAPI = require('sneaks-api')
const sneaks = new SneaksAPI()
const { toast } = require('react-toastify')
const dotenv = require('dotenv')
dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

// Middleware to parse JSON
app.use(express.json())

// Configure CORS to allow any origin
app.use(cors({
    origin: '*'
}))


// Route to handle sending email
app.post('/send-email', sendEmail)

// Endpoint to create a Stripe Checkout session
app.post('/api/create-checkout', async (req, res) => {
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

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna', 'affirm'],
            line_items,
            mode: 'payment',
            success_url: `https://quick-cart-react-js.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'https://quick-cart-react-js.vercel.app/cart',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'], // Specify allowed countries
            },
            // automatic_tax: {
            //     enabled: true,
            // },
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
            }, custom_text: {
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
});

function generateOrderNumber() {
    return `QC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

// Endpoint to retrieve a Stripe Checkout session
app.get('/api/retrieve-checkout-session/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        let delivery = 'N/A';  // Default value if no conditions are met

        // Determine the delivery estimate based on whether a shipping fee was charged
        if (session.total_details && session.total_details.amount_shipping > 0) {
            delivery = '3-5 business days';  // Paid shipping option
        } else {
            delivery = '5-7 business days';  // Free shipping option
        }

        res.json({
            orderNumber: session.metadata.order_number,
            totalAmount: (session.amount_total) / 100, // Including tax
            delivery: delivery
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve session", error: error.message });
    }
});

// Endpoint to clear the cart
app.post('/api/clear-cart', (req,res) => {
    res.status(200).json({success: true})
})

// Endpoint to search for products
app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    const allowedBrands = ['nike', 'puma', 'new balance', 'adidas', 'reebok'];

    // Allow search for both brand names and shoe names
    const brandQuery = allowedBrands.includes(query.toLowerCase()) ? query : '';

    try {
        // Search by brand if brandQuery is not empty, otherwise search by shoe name
        sneaks.getProducts(brandQuery || query, 50, (err, products) => {
            if (err) {
                return res.status(500).json({ error: `Error searching products: ${err.message}` });
            }
            res.json(products);
        });
    } catch (err) {
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
});

// Endpoint to get most popular sneakers
app.get('/api/mostPopular', async (req, res) => {
    try {
        const limit = 5
        sneaks.getMostPopular(limit, (err, products) => {
            if (err) {
                toast.error(`Error fetching most popular products: ${err.message}`)
                return res.status(500).json({ error: `Error fetching most popular products: ${err.message}` })
            }
            res.json(products)
        })
    } catch (err) {
        toast.error(`Server error: ${err.message}`)
        res.status(500).json({ error: `Server error: ${err.message}` })
    }
})

// Endpoint to get highest resale price products by brand
app.get('/api/highestResaleByBrand', async (req, res) => {
    const { brand } = req.query
    try {
        sneaks.getProducts(brand, 100, (err, products) => {
            if (err) {
                toast.error(`Error fetching highest resale products for brand ${brand}: ${err.message}`)
                return res.status(500).json({ error: `Error fetching highest resale products for brand ${brand}: ${err.message}` })
            }
            const sortedProducts = products.sort((a, b) => (b.lowestResellPrice?.stockX || 0) - (a.lowestResellPrice?.stockX || 0))
            const highestResaleProducts = sortedProducts.slice(2, 30)
            res.json(highestResaleProducts)
        })
    } catch (err) {
        toast.error(`Server error: ${err.message}`)
        res.status(500).json({ error: `Server error: ${err.message}` })
    }
})

// Endpoint to get product details by styleID
app.get('/api/product/:styleID', async (req, res) => {
    const { styleID } = req.params
    sneaks.getProductPrices(styleID, (err, product) => {
        if (err) {
            toast.error(`Error fetching product prices for styleID ${styleID}: ${err.message}`)
            return res.status(500).json({ error: `Error fetching product prices: ${err.message}` })
        }
        res.json(product)
    })
})

// Endpoint to get products sorted by lowest resale price
app.get('/api/lowestResale', async (req, res) => {
    try {
        // Fetching a larger number of products initially to ensure we have enough products from the specific brands
        sneaks.getProducts('shoes', 180, (err, products) => {
            if (err) {
                toast.error(`Error fetching products: ${err.message}`)
                return res.status(500).json({ error: `Error fetching products: ${err.message}` })
            }

            // Filter products to only include specific brands
            const filteredProducts = products.filter(product =>
                ['Adidas', 'Nike', 'New Balance', 'Puma', 'Reebok'].includes(product.brand)
            )

            res.json(filteredProducts)
        })
    } catch (err) {
        toast.error(`Server error: ${err.message}`)
        res.status(500).json({ error: `Server error: ${err.message}` })
    }
})

app.get('/', (req, res) => {
    res.status(200).send('Welcome to QuickCart API!');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
