function Carrusel() {

    return (
        <section id="productos" class="py-5">
                    <div class="container">
                        <h2 class="text-center mb-4">Novedades</h2>

                        <div id="productosCarousel" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                            </div>

                            <button class="carousel-control-prev" type="button" data-bs-target="#productosCarousel" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Anterior</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#productosCarousel" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Siguiente</span>
                            </button>

                            <div class="carousel-indicators mt-3">
                                <button type="button" data-bs-target="#productosCarousel" data-bs-slide-to="0" class="active"
                                    aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#productosCarousel" data-bs-slide-to="1"
                                    aria-label="Slide 2"></button>
                            </div>
                        </div>
                    </div>
                </section>
                
    )
}

export default Carrusel;