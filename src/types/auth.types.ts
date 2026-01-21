// export interface User {
//   id: string;
//   email: string;
//   role: "ADMIN" | "CONTENT_MANAGER";
//   fullName?: string | null;
// }

export interface CreateUserPayload {
  email: string
  fullName: string
  password: string
}

export type UserRole = "ADMIN" | "CONTENT_MANAGER"

export interface User {
  id: string
  email: string
  fullName: string | null
  role: UserRole
  isActive: boolean
  createdAt?: string
}


export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
