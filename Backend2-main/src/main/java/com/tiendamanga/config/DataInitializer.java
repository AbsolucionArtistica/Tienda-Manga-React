package com.tiendamanga.config;

import com.tiendamanga.models.User;
import com.tiendamanga.repositories.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @PersistenceContext
    EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Ensure manga IDs start at 4000 to avoid clashing with external API IDs
        try {
            entityManager.createNativeQuery("ALTER TABLE mangas ALTER COLUMN id RESTART WITH 4000").executeUpdate();
        } catch (Exception ignored) {
            // Ignore if the database already uses a compatible sequence/identity
        }

        // Crear Admin si no existe
        if (!userRepository.existsByUsername("Admin")) {
            User admin = new User();
            admin.setUsername("Admin");
            admin.setPassword(encoder.encode("Admin123"));
            admin.setEmail("admin@correo.com");
            admin.setDireccion("Oficina Central");
            admin.setTelefono("000-000-0000");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Usuario Admin creado: Admin / Admin123");
        }

        // Crear Cliente si no existe
        if (!userRepository.existsByUsername("Cliente")) {
            User user = new User();
            user.setUsername("Cliente");
            user.setPassword(encoder.encode("Cliente"));
            user.setEmail("cliente@correo.com");
            user.setDireccion("Direccion Cliente");
            user.setTelefono("111-111-1111");
            user.setRole(User.Role.CLIENTE);
            userRepository.save(user);
            System.out.println("Usuario Cliente creado: Cliente / Cliente");
        }
    }
}
