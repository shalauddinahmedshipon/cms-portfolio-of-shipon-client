export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "CONTENT_MANAGER";
  fullName?: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
