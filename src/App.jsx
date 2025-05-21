import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Order from './pages/Order';
import Specials from './pages/Specials';
import WhereWeAre from './pages/WhereWeAre';
import About from './pages/About';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <div className="min-h-screen bg-yellow-50 p-4">
     <nav className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded-xl shadow justify-center">
  <Link to="/" className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-4 py-2 rounded">
    Home
  </Link>
  <Link to="/menu" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold px-4 py-2 rounded">
    Menu
  </Link>
  <Link to="/order" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded">
    Order
  </Link>
  <Link to="/specials" className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-4 py-2 rounded">
    Specials
  </Link>
  <Link to="/where-we-are" className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold px-4 py-2 rounded">
    Where We Are
  </Link>
  <Link to="/about" className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold px-4 py-2 rounded">
    About
  </Link>
  <Link to="/order-history" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded">
    Order History
  </Link>
</nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order" element={<Order />} />
        <Route path="/specials" element={<Specials />} />
        <Route path="/where-we-are" element={<WhereWeAre />} />
        <Route path="/about" element={<About />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Routes>
    </div>
  );
}

export default App;
