package com.tshirtstore.repository;

import com.tshirtstore.entity.ReviewHelpfulVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewHelpfulVoteRepository extends JpaRepository<ReviewHelpfulVote, Long> {

    Optional<ReviewHelpfulVote> findByReviewIdAndUserId(Long reviewId, Long userId);

    boolean existsByReviewIdAndUserId(Long reviewId, Long userId);

    long countByReviewId(Long reviewId);
}
