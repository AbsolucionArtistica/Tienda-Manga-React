import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CarritoLateral from './components/CarritoLateral';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { CarritoProvider } from './context/CarritoContext';
import Checkout from './pages/Checkout';
import Contacto from './pages/Contacto';
import Home from './pages/Home';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Producto from './pages/Producto';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Tienda from './pages/Tienda';
import MangaAdminForm from './pages/admin/MangaAdminForm';
import MangaAdminList from './pages/admin/MangaAdminList';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/producto/:id" element={<Producto />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contacto" element={<Contacto />} />

            <Route element={<ProtectedRoute role="ADMIN" />}>
              <Route path="/admin/mangas" element={<MangaAdminList />} />
              <Route path="/admin/mangas/crear" element={<MangaAdminForm />} />
              <Route path="/admin/mangas/editar/:id" element={<MangaAdminForm />} />
            </Route>
          </Routes>
          <Footer />
          <CarritoLateral />
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
