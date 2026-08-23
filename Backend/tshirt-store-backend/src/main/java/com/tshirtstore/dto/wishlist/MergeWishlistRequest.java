package com.tshirtstore.dto.wishlist;

import java.util.List;

public record MergeWishlistRequest(
    List<Long> productIds
) {}
