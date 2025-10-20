import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CarritoLateral from './components/CarritoLateral';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { CarritoProvider } from './context/CarritoContext';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Producto from './pages/Producto';
import Registro from './pages/Registro';
import Tienda from './pages/Tienda';
import './styles/main.css';

function App() {
  return (
    <CarritoProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
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
