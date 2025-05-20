import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Order() {
  const [cart, setCart] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const storedPhone = localStorage.getItem('phoneNumber') || '';
    const storedInstructions = localStorage.getItem('specialInstructions') || '';
    setCart(storedCart);
    setPhoneNumber(storedPhone);
    setSpecialInstructions(storedInstructions);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleConfirm = async () => {
    try {
      const response = await fetch('https://ruby-hotdog-stripe.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, phoneNumber, specialInstructions }),
      });
  
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating Stripe session.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('There was a problem with your payment. Please try again.');
    }
  };
  
  

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank you!</h2>
        <p className="text-lg">Your order has been received.</p>
        <p className="text-md mt-2 text-gray-600">We’ll text you if we have any questions.</p>
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate('/')}
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-red-700 mb-4">📦 Review Your Order</h2>

      <ul className="space-y-4 mb-6">
        {cart.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-semibold">
              {item.name} × {item.quantity || 1} – ${(
                item.price * (item.quantity || 1)
              ).toFixed(2)}
            </p>
            {item.toppings?.length > 0 && (
              <p className="text-sm">Toppings: {item.toppings.join(', ')}</p>
            )}
            {item.chip && <p className="text-sm">Chip: {item.chip}</p>}
            {item.drink && <p className="text-sm">Drink: {item.drink}</p>}
          </li>
        ))}
      </ul>

      <p className="font-semibold text-lg mb-2">📞 Phone Number: {phoneNumber}</p>
      <p className="text-sm mb-4">📝 Special Instructions: {specialInstructions || 'None'}</p>

      <p className="text-xl font-bold mb-4">Total: ${total.toFixed(2)}</p>

      <button
        onClick={handleConfirm}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold text-lg"
      >
        Confirm Order
      </button>
    </div>
  );
}

export default Order;
