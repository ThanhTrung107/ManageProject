import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

@Component({
  selector: 'app-login',
  imports: [FormsModule,
    CommonModule,
    RouterLink,
    Button,
    InputText,
    Password,
    Card,
    Message,
    Divider,
    IconField,
    InputIcon],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = "";
  password = "";
  errorMessage = "";
  isLoading = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    this.errorMessage = "";

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Vui lòng nhập tài khoản và mật khẩu!';
      return;
    }
    this.isLoading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Tài khoản hoặc mật khẩu không đúng!';
      }
    });
  }
}

