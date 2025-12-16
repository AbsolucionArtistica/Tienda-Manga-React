package com.tiendamanga.models;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "mangas")
public class Manga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String autor;
    private String editorial;
    private Double precio;
    private Integer stock;
    private String imagenUrl; // Para mostrar la portada en el frontend

}
