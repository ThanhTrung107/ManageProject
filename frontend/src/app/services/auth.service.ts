// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly ROLE_KEY = 'userRole';

//   constructor() { }

//   login(username: string, password: string): boolean {
//     if (username === 'admin' && password === 'admin') {
//       localStorage.setItem(this.ROLE_KEY, 'admin');
//       return true;
//     } else if (username && password) {
//       localStorage.setItem(this.ROLE_KEY, 'user');
//       return true;
//     }
//     return false;
//   }

//   isAdmin(): boolean {
//     return localStorage.getItem(this.ROLE_KEY) === 'admin';
//   }

//   isLoggedIn(): boolean {
//     return localStorage.getItem(this.ROLE_KEY) !== null;
//   }

//   getRole(): string | null {
//     return localStorage.getItem(this.ROLE_KEY);
//   }

//   logout(): void {
//     localStorage.removeItem(this.ROLE_KEY);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  username: string;
}
export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly ROLE_KEY = 'userRole';
  private readonly USERNAME_KEY = 'username';
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.ROLE_KEY, response.role);
          localStorage.setItem(this.USERNAME_KEY, response.username);
        })
      );
  }
  register(username: string, password: string, confirmPassword: string, role: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, {
      username,
      password,
      confirmPassword,
      role
    });
  }
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

  isAdmin(): boolean {
    return localStorage.getItem(this.ROLE_KEY)?.toUpperCase() === 'ADMIN';
  }

  isUser(): boolean {
    return localStorage.getItem(this.ROLE_KEY)?.toUpperCase() === 'USER';
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token !== null && token.length > 0;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.USERNAME_KEY);

  }

  // Kiểm tra quyền truy cập
  canDelete(): boolean {
    return this.isAdmin();
  }

  canCreate(): boolean {
    return this.isAdmin();
  }

  canEdit(): boolean {
    return this.isLoggedIn(); // Cả USER và ADMIN đều có thể edit
  }

  canView(): boolean {
    return this.isLoggedIn(); // Cả USER và ADMIN đều có thể xem
  }
}
