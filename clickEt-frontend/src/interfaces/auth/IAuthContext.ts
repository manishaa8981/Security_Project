export interface IUser {
  full_name: string;
  user_name: string;
  email: string;
  profile_URL: string;
  role: string;
}

export enum ERoles {
  ADMIN = "ADMIN",
  EDITOR = "editor",
  VIEWER = "viewer",
  USER = "user",
}

export interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  logout: () => Promise<void>;
}
