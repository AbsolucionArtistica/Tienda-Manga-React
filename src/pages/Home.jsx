import { Link, NavLink } from "react-router";
import Carrusel from "../components/Carrusel";
import Footer from "../components/Footer";

function Home() {

    return (
        <div>
            <header class="text-white text-center py-5 main-color">
                <div class="container">
                    <h1 class="display-4">Bienvenido a MangoManga</h1>
                    <p class="lead">Los mejores mangas al mejor precio</p>
                    <a href="pages/productos.html" class="btn btn-light mt-3">Ver productos</a>
                </div>
            </header>
            <Carrusel />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </div>
    );
}

export default Home;