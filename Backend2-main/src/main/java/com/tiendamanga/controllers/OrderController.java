package com.tiendamanga.controllers;

import com.tiendamanga.models.Manga;
import com.tiendamanga.models.Order;
import com.tiendamanga.models.User;
import com.tiendamanga.repositories.MangaRepository;
import com.tiendamanga.repositories.OrderRepository;
import com.tiendamanga.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MangaRepository mangaRepository;

    @GetMapping("/my-orders")
    public List<Order> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return orderRepository.findByUserUsername(username);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario no encontrado");
        }

        List<Manga> items = new ArrayList<>();
        double total = 0.0;

        for (OrderItem item : request.getItems()) {
            Optional<Manga> mangaOpt = mangaRepository.findById(item.getId());
            if (mangaOpt.isPresent()) {
                Manga manga = mangaOpt.get();
                items.add(manga);
                total += (manga.getPrecio() != null ? manga.getPrecio() : 0) * Math.max(item.getCantidad(), 1);
            }
        }

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setMangas(items);
        order.setTotal(total);

        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(saved);
    }

    public static class OrderRequest {
        private List<OrderItem> items;

        public List<OrderItem> getItems() {
            return items == null ? List.of() : items;
        }

        public void setItems(List<OrderItem> items) {
            this.items = items;
        }
    }

    public static class OrderItem {
        private Long id;
        private int cantidad;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public int getCantidad() {
            return cantidad;
        }

        public void setCantidad(int cantidad) {
            this.cantidad = cantidad;
        }
    }
}
