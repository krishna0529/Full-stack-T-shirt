export interface CustomerProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  phone?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
}
