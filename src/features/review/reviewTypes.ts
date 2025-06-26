export interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  productName: string;
  orderId?: string;
  rating: number;
  comment: string;
  images: string[];
  isApproved: boolean;
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface ReviewListResponse {
  reviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: RatingDistribution;
}

export interface UserReviewListResponse {
  reviews: Review[];
  total: number;
}

export interface ReviewCreatePayload {
  productId: string;
  orderId?: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface ReviewUpdatePayload {
  rating?: number;
  comment?: string;
  images?: string[];
}

export interface ReviewState {
  loading: boolean;
  error: string | null;
  reviews: Review[];
  userReviews: Review[];
  total: number;
  averageRating: number;
  ratingDistribution: RatingDistribution;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}
