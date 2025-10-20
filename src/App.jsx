import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Tienda from './pages/Tienda';
import Producto from './pages/Producto';
import Checkout from './pages/Checkout';
import './styles/main.css';
import Footer from './components/Footer';
import { CarritoProvider } from './context/CarritoContext';
import CarritoLateral from './components/CarritoLateral';

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <Footer />
        <CarritoLateral />
      </BrowserRouter>
    </CarritoProvider>
  );
}

export default App;
