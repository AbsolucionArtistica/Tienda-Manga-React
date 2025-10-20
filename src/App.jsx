import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Tienda from './pages/Tienda'
import './styles/main.css'
import Footer from './components/Footer'
import { CarritoProvider } from './context/CarritoContext'
import CarritoLateral from './components/CarritoLateral'

function App() {

  return (
    <CarritoProvider>
      <BrowserRouter>
        <Navbar />
        <main className="page-content">
          <Routes>
            <Route path='' element={<Home />} />
            <Route path='/tienda' element={<Tienda />} />
          </Routes>
        </main>
        <Footer />
        <CarritoLateral />
      </BrowserRouter>
    </CarritoProvider>
  )
}

export default App
