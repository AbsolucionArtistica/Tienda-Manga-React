import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMangas, deleteManga } from '../../services/mangaService';

const MangaAdminList = () => {
    const [mangas, setMangas] = useState([]);

    useEffect(() => {
        cargarMangas();
    }, []);

    const cargarMangas = async () => {
        try {
            const data = await getAllMangas();
            setMangas(data);
        } catch (error) {
            console.error('Error al cargar mangas:', error);
        }
    };

    const eliminarManga = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este manga?')) {
            try {
                await deleteManga(id);
                cargarMangas();
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Administración de Mangas</h2>
            <Link to="/admin/mangas/crear" className="btn btn-primary mb-3">
                Nuevo Manga
            </Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {mangas.map((manga) => (
                        <tr key={manga.id}>
                            <td>{manga.id}</td>
                            <td>{manga.titulo}</td>
                            <td>{manga.autor}</td>
                            <td>${manga.precio}</td>
                            <td>{manga.stock}</td>
                            <td>
                                <Link to={`/admin/mangas/editar/${manga.id}`} className="btn btn-warning btn-sm me-2">
                                    Editar
                                </Link>
                                <button onClick={() => eliminarManga(manga.id)} className="btn btn-danger btn-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MangaAdminList;
