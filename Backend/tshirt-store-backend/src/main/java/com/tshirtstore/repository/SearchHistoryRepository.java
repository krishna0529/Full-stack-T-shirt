package com.tshirtstore.repository;

import com.tshirtstore.entity.SearchHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SearchHistoryRepository extends JpaRepository<SearchHistory, Long> {

    Optional<SearchHistory> findByUserIdAndQuery(Long userId, String query);

    List<SearchHistory> findTop10ByUserIdOrderByLastSearchedAtDesc(Long userId);

    @Query("SELECT sh.query FROM SearchHistory sh GROUP BY sh.query ORDER BY SUM(sh.searchCount) DESC LIMIT 8")
    List<String> findTopPopularSearchQueries();
}
