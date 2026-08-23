-- Production Indexing Script for High-Performance Query Execution

-- Product Catalog Indexes
CREATE INDEX idx_product_slug ON products(slug);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_product_active ON products(active);

-- Variant Indexes
CREATE INDEX idx_variant_sku ON product_variants(sku);
CREATE INDEX idx_variant_product ON product_variants(product_id);

-- Order Indexes
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_order_status ON orders(status);
CREATE INDEX idx_order_created_at ON orders(created_at);

-- Payment Indexes
CREATE INDEX idx_payment_order ON payments(order_id);
CREATE INDEX idx_payment_status ON payments(status);

-- Wishlist & Recently Viewed Indexes
CREATE INDEX idx_wishlist_user ON wishlists(user_id);
CREATE INDEX idx_wishlist_item_product ON wishlist_items(product_id);
CREATE INDEX idx_recent_user_viewed ON recently_viewed_products(user_id, viewed_at);
