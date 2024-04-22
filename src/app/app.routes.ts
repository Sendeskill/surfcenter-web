import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoggedComponent } from './shared/logged/logged.component';
import { LoginComponent } from './shared/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LoggedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
];
