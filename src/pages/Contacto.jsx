const Contacto = () => {
  return (
    <main className="container py-5">
      <section className="row justify-content-center">
        <article className="col-lg-8">
          <h1 className="h3 mb-3">Contacto</h1>
          <p className="text-muted">Escríbenos para consultas sobre pedidos, stock o soporte.</p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <strong>Correo:</strong> soporte@mangomanga.cl
            </li>
            <li className="mb-2">
              <strong>Teléfono:</strong> +56 9 1234 5678
            </li>
            <li className="mb-2">
              <strong>Horario:</strong> Lun-Vie 09:00 - 18:00
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
};

export default Contacto;
