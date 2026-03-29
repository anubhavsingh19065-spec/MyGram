package com.anubhav.mygram.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.anubhav.mygram.backend.model.Post;
import com.anubhav.mygram.backend.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository repo;

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return repo.save(post);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return repo.findAll();
    }
}