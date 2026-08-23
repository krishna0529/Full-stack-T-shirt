export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

export interface ReviewResponse {
  id: number;
  productId: number;
  customerName: string;
  customerAvatar?: string | null;
  rating: number;
  title?: string | null;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  helpfulByCurrentUser: boolean;
  images: string[];
  status: ReviewStatus;
  createdAt: string;
}

export interface RatingSummaryResponse {
  averageRating: number;
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewPayload {
  rating: number;
  title?: string;
  comment: string;
}
