package com.na.manager.manager.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    
    // Add this method to check if a user exists with the given email
    boolean existsByEmail(String email);
}
