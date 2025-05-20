import { useState } from 'react';
import { mealDeals, alaCarteDogs, toppings, chips, drinks } from '../data/menuItems';

function Menu() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Meal Deals Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">Meal Deals</h2>
          <ul className="grid gap-4">
            {mealDeals.map((item, index) => (
              <li key={index}>
                <button
                  className="w-full text-left bg-yellow-100 p-4 rounded-lg shadow hover:bg-yellow-200"
                  onClick={() => setSelectedItem({ ...item, category: 'meal' })}
                >
                  {item.name} – ${item.price.toFixed(2)}<br />
                  <span className="text-sm text-gray-600">Includes chips & drink</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* À La Carte Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-red-600">À La Carte</h2>
          <ul className="grid gap-4">
            {alaCarteDogs.map((item, index) => (
              <li key={index}>
                <button
                  className="w-full text-left bg-blue-100 p-4 rounded-lg shadow hover:bg-blue-200"
                  onClick={() => setSelectedItem({ ...item, category: 'alaCarte' })}
                >
                  {item.name} – ${item.price.toFixed(2)}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Chips + Drinks Dropdowns */}
      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {/* Chips Dropdown */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Order Chips Only</h2>
          <select
            className="w-full p-3 rounded border bg-pink-50"
            defaultValue=""
            onChange={(e) => {
              const selectedChip = e.target.value;
              if (selectedChip) {
                setSelectedItem({
                  name: selectedChip,
                  price: 1.0,
                  category: 'chipOnly',
                  quantity: 1
                });
              }
            }}
          >
            <option value="">-- Select a Chip --</option>
            {chips.map((chip, i) => (
              <option key={i} value={chip}>
                {chip} – $1.00
              </option>
            ))}
          </select>
        </div>

        {/* Drinks Dropdown */}
        <div>
          <h2 className="text-2xl font-bold mb-2 text-red-600">Order Drinks Only</h2>
          <select
            className="w-full p-3 rounded border bg-purple-50"
            defaultValue=""
            onChange={(e) => {
              const selectedDrink = e.target.value;
              if (selectedDrink) {
                setSelectedItem({
                  name: selectedDrink,
                  price: 2.0,
                  category: 'drinkOnly',
                  quantity: 1
                });
              }
            }}
          >
            <option value="">-- Select a Drink --</option>
            {drinks.map((drink, i) => (
              <option key={i} value={drink}>
                {drink} – $2.00
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Customization Section */}
      {selectedItem && (
        <div className="mt-8 p-4 border rounded-lg bg-white shadow">
          <h3 className="text-xl font-bold text-green-700 mb-2">
            Customize: {selectedItem.name}
          </h3>

          {!['chipOnly', 'drinkOnly'].includes(selectedItem.category) && (
            <div className="mb-4">
              <p className="font-semibold">Choose Toppings:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {toppings.map((topping, i) => (
                  <label key={i} className="text-sm">
                    <input
                      type="checkbox"
                      value={topping}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const value = e.target.value;
                        const newToppings = selectedItem.toppings || [];
                        if (checked) {
                          setSelectedItem({
                            ...selectedItem,
                            toppings: [...newToppings, value],
                          });
                        } else {
                          setSelectedItem({
                            ...selectedItem,
                            toppings: newToppings.filter(t => t !== value),
                          });
                        }
                      }}
                    />{" "}
                    {topping}
                  </label>
                ))}
              </div>
            </div>
          )}

          {selectedItem.category === 'meal' && (
            <>
              <div className="mb-4">
                <p className="font-semibold">Choose a Chip:</p>
                <select
                  className="w-full p-2 rounded border"
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, chip: e.target.value })
                  }
                >
                  <option value="">-- Select a Chip --</option>
                  {chips.map((chip, i) => (
                    <option key={i} value={chip}>{chip}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Choose a Drink:</p>
                <select
                  className="w-full p-2 rounded border"
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, drink: e.target.value })
                  }
                >
                  <option value="">-- Select a Drink --</option>
                  {drinks.map((drink, i) => (
                    <option key={i} value={drink}>{drink}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="mb-4">
            <p className="font-semibold">Quantity:</p>
            <input
              type="number"
              min="1"
              defaultValue="1"
              className="w-20 p-2 border rounded"
              onChange={(e) =>
                setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 1 })
              }
            />
          </div>

          <button
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setCart([...cart, selectedItem]);
              alert("Item added to order! Want to add something else?");
              setSelectedItem(null);
            }}
          >
            Add to Order
          </button>
        </div>
      )}

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="mt-10 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-3 text-red-700">🧾 Your Order</h3>
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="border-b pb-2">
                <p className="font-semibold">
                  {item.name} × {item.quantity || 1} – ${(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
                {item.toppings?.length > 0 && (
                  <p className="text-sm">Toppings: {item.toppings.join(", ")}</p>
                )}
                {item.chip && <p className="text-sm">Chip: {item.chip}</p>}
                {item.drink && <p className="text-sm">Drink: {item.drink}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold text-lg">
            Total: ${cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0).toFixed(2)}
          </p>
        </div>
      )}
      {/* Check Out Button */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <label className="block font-semibold mb-2">
          📞 Callback Phone Number:
        </label>
        <input
          type="tel"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <label className="block font-semibold mb-2">
          📝 Special Instructions:
        </label>
        <textarea
          placeholder="Anything extra we should know?"
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={3}
        />

        <button
          disabled={phoneNumber.trim() === ''}
          onClick={() => {
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('phoneNumber', phoneNumber);
            localStorage.setItem('specialInstructions', specialInstructions);
            window.location.href = '/order';
          }}

          className={`w-full py-2 px-4 rounded font-bold text-white ${phoneNumber.trim() === '' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          Proceed to Checkout
        </button>
      </div>

    </div>
  );

}

export default Menu;