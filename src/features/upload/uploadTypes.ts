export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface MultipleUploadResponse {
  uploads: UploadResponse[];
  failed: string[];
}

export interface UploadState {
  loading: {
    reviewUploadLoading: boolean;
    cartUploadLoading: boolean;
    profileUploadLoading: boolean;
    singleUploadLoading: boolean;
  };
  error: string | null;
  singleUpload: UploadResponse | null;
  reviewImages: MultipleUploadResponse | null;
  cartImages: MultipleUploadResponse | null;
  profileImages: MultipleUploadResponse | null;
}
