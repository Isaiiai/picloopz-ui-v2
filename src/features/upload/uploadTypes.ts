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
  loading: boolean;
  error: string | null;
  singleUpload: UploadResponse | null;
  multipleUpload: MultipleUploadResponse | null;
}
