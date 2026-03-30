package com.anubhav.mygram.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.anubhav.mygram.backend.model.Follow;

import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    List<Follow> findByFollowing(String username);
    List<Follow> findByFollower(String username);

    @Transactional
    void deleteByFollowerAndFollowing(String follower, String following);
}