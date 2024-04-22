import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  login: Login = new Login();

  @Output() submitEM = new EventEmitter();
  @Input()
  error!: string | null;
  logged = false;
  gerarNovaSenha = false;

  form: FormGroup = new FormGroup({
    password: new FormControl(''),
    email: new FormControl(''),
    rememberMe: new FormControl(true),
  });
  constructor(
    private router: Router,
    private loginService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  localStorage = this.document.defaultView?.localStorage;

  ngOnInit(): void {
    this.loginService.logout();
    const savedLogin = this.localStorage?.getItem('savedLogin');
    const savedPassword = this.localStorage?.getItem('savedPassword');

    if (savedLogin && savedPassword) {
      this.form.get('email')?.setValue(savedLogin);
      this.form.get('password')?.setValue(savedPassword);
      this.login.email = savedLogin;
      this.login.password = savedPassword;
    }
  }

  esqueciMinhaSenha(): void {
    this.gerarNovaSenha = true;
  }

  submit() {
    if (this.form.valid) {
      if (this.form.get('rememberMe')?.value) {
        this.localStorage?.setItem('savedLogin', this.form.get('email')?.value);
        this.localStorage?.setItem(
          'savedPassword',
          this.form.get('password')?.value
        );
      } else {
        this.localStorage?.clear();
      }
      this.submitEM.emit(this.form.value);
      this.router.navigate(['/home']);
      // this.loginService.login(this.login).subscribe({
      //   next: () => {
      //   },
      //   error: (err) => {
      //     console.log(err);
      //   },
      // });
    }
  }
}
