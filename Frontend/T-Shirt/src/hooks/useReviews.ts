import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/reviewService";
import type { CreateReviewPayload, UpdateReviewPayload } from "../types/review";

export function useProductReviews(
  productId: number,
  page = 0,
  size = 10,
  sortBy = "createdAt",
  direction = "desc"
) {
  return useQuery({
    queryKey: ["product-reviews", productId, page, size, sortBy, direction],
    queryFn: () => reviewService.getProductReviews(productId, page, size, sortBy, direction),
    enabled: Boolean(productId),
  });
}

export function useRatingSummary(productId: number) {
  return useQuery({
    queryKey: ["rating-summary", productId],
    queryFn: () => reviewService.getRatingSummary(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(productId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["rating-summary", productId] });
    },
  });
}

export function useUpdateReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: number; payload: UpdateReviewPayload }) =>
      reviewService.updateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["rating-summary", productId] });
    },
  });
}

export function useDeleteReview(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["rating-summary", productId] });
    },
  });
}

export function useToggleHelpfulVote(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: number) => reviewService.toggleHelpfulVote(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
  });
}

// Admin Moderation Hooks
export function usePendingReviews(page = 0, size = 10) {
  return useQuery({
    queryKey: ["pending-reviews", page, size],
    queryFn: () => reviewService.getPendingReviews(page, size),
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.approveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
    },
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.rejectReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
    },
  });
}

export function useHideReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => reviewService.hideReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
    },
  });
}
