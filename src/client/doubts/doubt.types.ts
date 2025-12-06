export interface CreateDoubtData {
  fullName?: string;
  dob?: string;
  phoneNumber: string;
  gender?: string;
  questionCategory: string;
  questionDescription: string;
  location?: string;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  requestTime?: string;
}

export interface DoubtResponse {
  id: string;
  fullName: string;
  dob?: Date | null;
  phoneNumber: string;
  gender?: string | null;
  category: string;
  question: string;
  answer: string;
  location?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedDoubtsResponse {
  doubts: DoubtResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AddAnswerData {
  answer: string;
}