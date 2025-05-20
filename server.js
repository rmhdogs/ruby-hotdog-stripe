const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');

// Replace with your Stripe secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
  const { cart, phoneNumber, specialInstructions } = req.body;

  const lineItems = cart.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        description: [
          item.toppings?.length ? `Toppings: ${item.toppings.join(', ')}` : '',
          item.chip ? `Chip: ${item.chip}` : '',
          item.drink ? `Drink: ${item.drink}` : '',
          specialInstructions ? `Note: ${specialInstructions}` : ''
        ].filter(Boolean).join(' | ')
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || 1,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://your-frontend.com/order?success=true',
      cancel_url: 'https://your-frontend.com/order?canceled=true',
      metadata: {
        phoneNumber,
        specialInstructions,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Something went wrong creating session.' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
