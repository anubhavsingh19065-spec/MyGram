package com.anubhav.mygram.backend.service;

import com.anubhav.mygram.backend.model.User;
import com.anubhav.mygram.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User register(User user) {
        return repo.save(user);
    }

    public User login(String username, String password) {
        Optional<User> user = repo.findByUsername(username);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        return null;
    }
}