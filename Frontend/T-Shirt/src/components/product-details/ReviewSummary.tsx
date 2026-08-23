import { useState } from "react";
import { Star, CheckCircle2, ThumbsUp, Plus, Filter } from "lucide-react";
import { useProductReviews, useRatingSummary, useToggleHelpfulVote } from "../../hooks/useReviews";
import WriteReviewModal from "./WriteReviewModal";

interface ReviewSummaryProps {
  productId: number;
  productName?: string;
}

export default function ReviewSummary({ productId, productName }: ReviewSummaryProps) {

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: reviewsPage, isLoading } = useProductReviews(productId, page, 6, sortBy);
  const { data: summary } = useRatingSummary(productId);
  const toggleHelpfulMutation = useToggleHelpfulVote(productId);

  const reviews = reviewsPage?.content || [];
  const totalReviews = summary?.totalReviews || 0;
  const avgRating = summary?.averageRating || 0;

  const getPercentage = (count: number) => {
    if (!totalReviews || totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <section className="mt-20 border-t border-slate-200 dark:border-slate-800 pt-16 w-full space-y-10">
      {/* Header & Rating Summary Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[var(--color-surface)] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Left Rating Overall */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-5xl sm:text-6xl font-black text-[var(--color-foreground)] tracking-tight">
              {avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
            </span>
            <div className="flex justify-center gap-1 text-amber-400 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= Math.round(avgRating) ? "currentColor" : "none"}
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="mt-1.5 text-xs font-bold text-[var(--color-muted)]">
              {totalReviews} Verified Reviews
            </p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="hidden sm:block border-l border-slate-200 dark:border-slate-800 pl-6 space-y-1.5 min-w-[200px]">
            {[
              { stars: 5, count: summary?.fiveStar || 0 },
              { stars: 4, count: summary?.fourStar || 0 },
              { stars: 3, count: summary?.threeStar || 0 },
              { stars: 2, count: summary?.twoStar || 0 },
              { stars: 1, count: summary?.oneStar || 0 },
            ].map(({ stars, count }) => {
              const pct = getPercentage(count);
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-6 font-bold text-[var(--color-muted)]">{stars}★</span>
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-[10px] text-[var(--color-muted)]">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Action & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[var(--color-background)] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <Filter size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-[var(--color-foreground)] focus:outline-hidden cursor-pointer"
            >
              <option value="createdAt">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all shadow-md active:scale-95"
          >
            <Plus size={16} /> Write a Review
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-800 rounded-sm w-1/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-sm w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty Reviews State */}
      {!isLoading && reviews.length === 0 && (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <Star className="w-10 h-10 mx-auto text-amber-400 opacity-50" />
          <h3 className="text-sm font-bold text-[var(--color-foreground)]">No customer reviews yet</h3>
          <p className="text-xs text-[var(--color-muted)] max-w-sm mx-auto">
            Be the first customer with a delivered purchase to share your experience with this t-shirt.
          </p>
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-foreground)] text-[var(--color-background)] font-bold text-xs uppercase tracking-wider"
          >
            <Plus size={14} /> Write First Review
          </button>
        </div>
      )}

      {/* Review Cards Grid */}
      {!isLoading && reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <article
              key={rev.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-400 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div>
                {/* Header Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        fill={star <= rev.rating ? "currentColor" : "none"}
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[var(--color-muted)] font-mono">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                {/* Title & Comment */}
                {rev.title && (
                  <h4 className="text-sm font-bold text-[var(--color-foreground)] mb-1.5 leading-snug">
                    {rev.title}
                  </h4>
                )}
                <p className="text-xs text-[var(--color-foreground)] opacity-90 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                {/* Review Images */}
                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {rev.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-80 transition-all"
                      >
                        <img src={img} alt="Customer upload" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Author & Helpful Vote */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-500 font-extrabold text-xs flex items-center justify-center">
                    {rev.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[var(--color-foreground)]">{rev.customerName}</p>
                    {rev.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 size={11} /> Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                {/* Helpful Button */}
                <button
                  onClick={() => toggleHelpfulMutation.mutate(rev.id)}
                  disabled={toggleHelpfulMutation.isPending}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    rev.helpfulByCurrentUser
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                      : "text-slate-500 hover:text-[var(--color-foreground)] bg-slate-100 dark:bg-slate-800"
                  }`}
                >
                  <ThumbsUp size={13} className={rev.helpfulByCurrentUser ? "fill-amber-500" : ""} />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {reviewsPage && reviewsPage.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-[var(--color-muted)]">
            Page {page + 1} of {reviewsPage.totalPages}
          </span>
          <button
            disabled={page >= reviewsPage.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productId={productId}
        productName={productName}
      />

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 cursor-pointer"
        >
          <img src={selectedImage} alt="Enlarged review" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain" />
        </div>
      )}
    </section>
  );
}
