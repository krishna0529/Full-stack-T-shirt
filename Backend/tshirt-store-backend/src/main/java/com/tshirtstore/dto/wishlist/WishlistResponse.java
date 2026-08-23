package com.tshirtstore.dto.wishlist;

import com.tshirtstore.dto.ProductResponse;
import java.util.List;

public record WishlistResponse(
    List<ProductResponse> items,
    int count
) {}
