package com.anubhav.mygram.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.anubhav.mygram.backend.model.Follow;
import com.anubhav.mygram.backend.repository.FollowRepository;

import java.util.List;

@RestController
@RequestMapping("/api/follow")
@CrossOrigin(origins = "*")
public class FollowController {

    @Autowired
    private FollowRepository repo;

    // FOLLOW
    @PostMapping
    public Follow follow(@RequestBody Follow f) {
        return repo.save(f);
    }

    // UNFOLLOW
    @DeleteMapping
    public String unfollow(@RequestParam String follower, @RequestParam String following) {
    List<Follow> list = repo.findByFollower(follower);

        list.stream()
            .filter(f -> f.getFollowing().equals(following))
            .forEach(repo::delete);

        return "Unfollowed";
    }

    // GET FOLLOWERS
    @GetMapping("/followers/{username}")
    public List<Follow> getFollowers(@PathVariable String username) {
        return repo.findByFollowing(username);
    }

    // GET FOLLOWING
    @GetMapping("/following/{username}")
    public List<Follow> getFollowing(@PathVariable String username) {
        return repo.findByFollower(username);
    }
}