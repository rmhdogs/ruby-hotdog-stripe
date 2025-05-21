const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, phoneNumber, specialInstructions } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or missing' });
    }
    const line_items = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name || 'Hotdog Combo',
          description: [
            item.toppings?.length ? `Toppings: ${item.toppings.join(', ')}` : '',
            item.chip ? `Chip: ${item.chip}` : '',
            item.drink ? `Drink: ${item.drink}` : '',
            specialInstructions ? `Note: ${specialInstructions}` : '',
          ].filter(Boolean).join(' | ')
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    // Add tax
    const subtotal = cart.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      return total + quantity * price;
    }, 0);

    const taxAmount = Math.round(subtotal * 0.071 * 100);

    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Sales Tax (7.1%)'
        },
        unit_amount: taxAmount
      },
      quantity: 1
    });


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://rubymountainhotdogs.com/success', // replace with real success URL
      cancel_url: 'https://rubymountainhotdogs.com/cancel',   // replace with real cancel URL
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Something went wrong creating session.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
