import { User } from './components/UserContext';

const authKey = 'um.auth';

export function saveAuth(user: User, token: string): void {
  localStorage.setItem(authKey, JSON.stringify({ user, token }));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return JSON.parse(auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return JSON.parse(auth).token;
}
