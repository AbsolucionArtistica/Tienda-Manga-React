package com.tiendamanga.services;

import com.tiendamanga.models.Manga;
import com.tiendamanga.repositories.MangaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MangaService {

    @Autowired
    private MangaRepository mangaRepository;

    public List<Manga> getAllMangas() {
        return mangaRepository.findAll();
    }

    public Optional<Manga> getMangaById(Long id) {
        return mangaRepository.findById(id);
    }

    public Manga createManga(Manga manga) {
        return mangaRepository.save(manga);
    }

    public Manga updateManga(Long id, Manga mangaDetails) {
        Manga manga = mangaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manga no encontrado con id: " + id));

        manga.setTitulo(mangaDetails.getTitulo());
        manga.setAutor(mangaDetails.getAutor());
        manga.setEditorial(mangaDetails.getEditorial());
        manga.setPrecio(mangaDetails.getPrecio());
        manga.setStock(mangaDetails.getStock());
        manga.setImagenUrl(mangaDetails.getImagenUrl());

        return mangaRepository.save(manga);
    }

    public void deleteManga(Long id) {
        mangaRepository.deleteById(id);
    }
}
