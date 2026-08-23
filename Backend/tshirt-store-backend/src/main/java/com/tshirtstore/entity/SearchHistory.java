package com.tshirtstore.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "search_history",
    indexes = {
        @Index(name = "idx_search_user", columnList = "user_id"),
        @Index(name = "idx_search_query", columnList = "query")
    }
)
public class SearchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String query;

    private int searchCount = 1;

    private LocalDateTime lastSearchedAt;
    private LocalDateTime createdAt;

    public SearchHistory() {}

    public SearchHistory(User user, String query) {
        this.user = user;
        this.query = query;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        lastSearchedAt = now;
        createdAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        lastSearchedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public int getSearchCount() { return searchCount; }
    public void setSearchCount(int searchCount) { this.searchCount = searchCount; }

    public LocalDateTime getLastSearchedAt() { return lastSearchedAt; }
    public void setLastSearchedAt(LocalDateTime lastSearchedAt) { this.lastSearchedAt = lastSearchedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
