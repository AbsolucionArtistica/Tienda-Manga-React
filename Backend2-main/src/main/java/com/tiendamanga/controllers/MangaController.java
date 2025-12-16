package com.tiendamanga.controllers;

import com.tiendamanga.models.Manga;
import com.tiendamanga.services.MangaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mangas")
@CrossOrigin(origins = "*")
public class MangaController {

    @Autowired
    private MangaService mangaService;

    @GetMapping
    public List<Manga> getAllMangas() {
        return mangaService.getAllMangas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manga> getMangaById(@PathVariable Long id) {
        return mangaService.getMangaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Manga createManga(@RequestBody Manga manga) {
        return mangaService.createManga(manga);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manga> updateManga(@PathVariable Long id, @RequestBody Manga mangaDetails) {
        try {
            Manga updatedManga = mangaService.updateManga(id, mangaDetails);
            return ResponseEntity.ok(updatedManga);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteManga(@PathVariable Long id) {
        mangaService.deleteManga(id);
        return ResponseEntity.noContent().build();
    }
}
