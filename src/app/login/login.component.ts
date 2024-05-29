import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AccountService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, role } = this.loginForm.value;

    this.accountService.login(email, password, role)
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Login error: ', error);
      });
  }
}
