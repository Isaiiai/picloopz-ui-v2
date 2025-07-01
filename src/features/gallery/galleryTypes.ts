
export interface Reel {
  _id: string;
  title: string;
  description?: string;
  instagramUrl: string;
  thumbnailUrl?: string;
  postedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GalleryState {
  reels: Reel[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
}
