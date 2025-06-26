export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string; 
}

export interface UpdateProfile {
  name?: string;
  phone?: string;
  profileImage?: string;
}