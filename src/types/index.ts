export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
}

export interface Book {
  id: number;
  title: string;
  sub_title?: string;
  description?: string;
  author: string;
  editors?: string;
  image?: string;
  published: boolean;
  published_at?: string;
  publisher: string;
  language: string;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface CreateBookData {
  title: string;
  sub_title?: string;
  description?: string;
  author: string;
  editors?: string;
  image?: string;
  published: boolean;
  published_at?: string;
  publisher: string;
  language: string;
}

export interface UpdateBookData extends Partial<CreateBookData> {}
