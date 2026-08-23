import { api } from "./api";
import type {
  ReviewResponse,
  RatingSummaryResponse,
  CreateReviewPayload,
  UpdateReviewPayload,
} from "../types/review";
import type { PageResponse } from "../types/product";

export const reviewService = {
  getProductReviews: async (
    productId: number,
    page = 0,
    size = 10,
    sortBy = "createdAt",
    direction = "desc"
  ): Promise<PageResponse<ReviewResponse>> => {
    const response = await api.get(`/products/${productId}/reviews`, {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  getRatingSummary: async (productId: number): Promise<RatingSummaryResponse> => {
    const response = await api.get(`/products/${productId}/reviews/summary`);
    return response.data;
  },

  createReview: async (productId: number, payload: CreateReviewPayload): Promise<ReviewResponse> => {
    const response = await api.post(`/products/${productId}/reviews`, payload);
    return response.data;
  },

  updateReview: async (reviewId: number, payload: UpdateReviewPayload): Promise<ReviewResponse> => {
    const response = await api.put(`/reviews/${reviewId}`, payload);
    return response.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  toggleHelpfulVote: async (reviewId: number): Promise<ReviewResponse> => {
    const response = await api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Admin APIs
  getPendingReviews: async (page = 0, size = 10): Promise<PageResponse<ReviewResponse>> => {
    const response = await api.get("/admin/reviews", { params: { page, size } });
    return response.data;
  },

  approveReview: async (id: number): Promise<ReviewResponse> => {
    const response = await api.patch(`/admin/reviews/${id}/approve`);
    return response.data;
  },

  rejectReview: async (id: number): Promise<ReviewResponse> => {
    const response = await api.patch(`/admin/reviews/${id}/reject`);
    return response.data;
  },

  hideReview: async (id: number): Promise<ReviewResponse> => {
    const response = await api.patch(`/admin/reviews/${id}/hide`);
    return response.data;
  },
};
