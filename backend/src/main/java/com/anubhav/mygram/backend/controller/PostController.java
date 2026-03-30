package com.anubhav.mygram.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.ArrayList;

import com.anubhav.mygram.backend.model.Post;
import com.anubhav.mygram.backend.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")   // 🔥 ENABLE CORS
public class PostController {

    @Autowired
    private PostRepository repo;

    // ✅ CREATE POST
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return repo.save(post);
    }

    // ✅ GET ALL POSTS
    @GetMapping
    public List<Post> getAllPosts() {
        return repo.findAll();
    }

    // ❤️ LIKE POST
    @PostMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        Post post = repo.findById(id).orElseThrow();

        // if likes null → set 0
        if (post.getLikes() == null) {
            post.setLikes(0);
        }

        post.setLikes(post.getLikes() + 1);

        repo.save(post);

        return ResponseEntity.ok().build();
    }

    // 💬 COMMENT POST
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> commentPost(@PathVariable Long id, @RequestBody String comment) {
        Post post = repo.findById(id).orElseThrow();

        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }

        post.getComments().add(comment);

        repo.save(post);

        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}