import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ROLE_KEY = 'userRole';

  constructor() { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem(this.ROLE_KEY, 'admin');
      return true;
    } else if (username && password) {
      localStorage.setItem(this.ROLE_KEY, 'user');
      return true;
    }
    return false;
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.ROLE_KEY) === 'admin';
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.ROLE_KEY) !== null;
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.ROLE_KEY);
  }
}
