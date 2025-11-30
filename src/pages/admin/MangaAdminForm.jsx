import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createManga, getMangaById, updateManga } from '../../services/mangaService';

const MangaAdminForm = () => {
    const [manga, setManga] = useState({
        titulo: '',
        autor: '',
        editorial: '',
        precio: '',
        stock: '',
        imagenUrl: ''
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            cargarManga(id);
        }
    }, [id]);

    const cargarManga = async (id) => {
        try {
            const data = await getMangaById(id);
            setManga(data);
        } catch (error) {
            console.error('Error al cargar manga:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setManga({ ...manga, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateManga(id, manga);
            } else {
                await createManga(manga);
            }
            navigate('/admin/mangas');
        } catch (error) {
            console.error('Error al guardar:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>{id ? 'Editar Manga' : 'Nuevo Manga'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Título</label>
                    <input type="text" className="form-control" name="titulo" value={manga.titulo} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Autor</label>
                    <input type="text" className="form-control" name="autor" value={manga.autor} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Editorial</label>
                    <input type="text" className="form-control" name="editorial" value={manga.editorial} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input type="number" className="form-control" name="precio" value={manga.precio} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input type="number" className="form-control" name="stock" value={manga.stock} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">URL Imagen</label>
                    <input type="text" className="form-control" name="imagenUrl" value={manga.imagenUrl} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-success">Guardar</button>
            </form>
        </div>
    );
};

export default MangaAdminForm;
