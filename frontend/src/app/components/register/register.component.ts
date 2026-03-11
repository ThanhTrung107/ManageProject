import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

interface RoleOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    RouterLink,
    Button,
    InputText,
    Password,
    Card,
    Message,
    Divider,
    Select,
    IconField,
    InputIcon],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  confirmPassword = '';
  selectedRole: RoleOption | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  roleOptions: RoleOption[] = [
    { label: 'Người dùng (USER)', value: 'USER' },
    { label: 'Quản trị viên (ADMIN)', value: 'ADMIN' }
  ];
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.username.trim()) {
      this.errorMessage = 'Vui lòng nhập tên đăng nhập!';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Vui lòng nhập mật khẩu!';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp!';
      return;
    }

    if (!this.selectedRole) {
      this.errorMessage = 'Vui lòng chọn vai trò!';
      return;
    }

    this.isLoading = true;
    this.authService.register(
      this.username, 
      this.password, 
      this.confirmPassword, 
      this.selectedRole.value
    ).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...';
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.error?.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Đăng ký thất bại. Vui lòng thử lại!';
        }
      }
    });
  }
}