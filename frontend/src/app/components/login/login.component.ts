import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = "";
  password = "";
  errorMessage = "";

  constructor(private router: Router, private authService: AuthService) { }

  onLogin() {
    this.errorMessage = "";

    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Vui lòng nhập tài khoản và mật khẩu!';
      return;
    }

    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['dashboard']);
    } else {
      this.errorMessage = 'Vui lòng nhập tài khoản và mật khẩu!';
    }
  }
}

