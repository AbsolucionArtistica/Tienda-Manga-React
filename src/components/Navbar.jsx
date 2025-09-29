function Navbar() {

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">MangoManga</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><a className="nav-link active" href="/">Inicio</a></li>
                        <li className="nav-item"><a className="nav-link" href="pages/productos.html">Productos</a></li>
                        <li className="nav-item"><a className="nav-link" href="pages/contacto.html">Contacto</a></li>
                        <li className="nav-item"><a className="nav-link" href="pages/carrito.html">Carrito</a></li>
                        <li className="nav-item"><a className="nav-link" href="pages/cuenta.html">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                className="bi bi-person-circle" viewBox="0 0 16 16">
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path fillRule="evenodd"
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                            </svg>
                        </a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;