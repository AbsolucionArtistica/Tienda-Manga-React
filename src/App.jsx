import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import styles from './styles/main.css'
import Footer from './components/Footer'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='' element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
