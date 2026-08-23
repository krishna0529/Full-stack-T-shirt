import React, { useState } from "react";
import { Star, X, AlertCircle } from "lucide-react";
import { useCreateReview } from "../../hooks/useReviews";
import { useAuthStore } from "../../store/authStore";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName?: string;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName = "Product",
}) => {
  const { isAuthenticated } = useAuthStore();
  const createReviewMutation = useCreateReview(productId);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (imageUrlInput.trim() && images.length < 5) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrorMessage("Please sign in to write a review.");
      return;
    }
    if (!comment.trim()) {
      setErrorMessage("Review comment is required.");
      return;
    }

    createReviewMutation.mutate(
      { rating, title: title.trim() || undefined, comment: comment.trim(), images },
      {
        onSuccess: () => {
          onClose();
          setRating(5);
          setTitle("");
          setComment("");
          setImages([]);
          setErrorMessage(null);
        },
        onError: (err: unknown) => {
          const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setErrorMessage(apiMessage || "Only customers with delivered orders can submit a review.");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative my-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-[var(--color-foreground)]">Write a Customer Review</h3>
            <p className="text-xs text-[var(--color-muted)]">{productName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-semibold text-red-500 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Rating Picker */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[var(--color-muted)] mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 focus:outline-hidden transition-transform hover:scale-110"
                >
                  <Star
                    size={24}
                    fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
              <span className="ml-2 font-extrabold text-sm text-[var(--color-foreground)]">
                {hoverRating || rating}/5
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Premium fabric, perfect fit!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Your Detailed Review *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike about this product? How is the material and sizing?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)] focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Image URLs Input (Max 5) */}
          <div>
            <label className="block font-bold uppercase tracking-wider text-[var(--color-muted)] mb-1">
              Add Photo URLs (Optional, Max 5)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--color-background)] border border-slate-300 dark:border-slate-700 text-[var(--color-foreground)]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                disabled={images.length >= 5 || !imageUrlInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-[var(--color-foreground)] font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                Add Photo
              </button>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-0 right-0 bg-black/70 text-white p-0.5 rounded-bl-sm"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReviewMutation.isPending}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-amber-500 text-black hover:bg-amber-400 transition-all shadow-md disabled:opacity-50"
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
