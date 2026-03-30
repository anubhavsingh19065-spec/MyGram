package com.anubhav.mygram.backend.model;

import jakarta.persistence.*;

@Entity
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String follower; // who follows
    private String following; // who is being followed

    // getters & setters
    public String getFollower() { return follower; }
    public void setFollower(String follower) { this.follower = follower; }

    public String getFollowing() { return following; }
    public void setFollowing(String following) { this.following = following; }
}