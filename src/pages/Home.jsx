import { Link, NavLink } from "react-router";
import Carrusel from "../components/Carrusel";
import Footer from "../components/Footer";

function Home() {

    return (
        <div>
                <header className="text-white text-center py-5 main-color">
                    <div className="container">
                        <h1 className="display-4">Bienvenido a MangoManga</h1>
                        <p className="lead">Los mejores mangas al mejor precio</p>
                        <a href="pages/productos.html" className="btn btn-light mt-3">Ver productos</a>
                    </div>
                </header>
                <Carrusel />
            </div>
    );
}

export default Home;