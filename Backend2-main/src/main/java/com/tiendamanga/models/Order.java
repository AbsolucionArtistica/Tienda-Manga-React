package com.tiendamanga.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
        name = "order_mangas",
        joinColumns = @JoinColumn(name = "order_id"),
        inverseJoinColumns = @JoinColumn(name = "manga_id")
    )
    private List<Manga> mangas;

    private Double total;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fecha;

    @PrePersist
    protected void onCreate() {
        fecha = new Date();
    }
}
