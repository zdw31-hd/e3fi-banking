export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}
