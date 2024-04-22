import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Login } from '../../models/login.model';

@Injectable({
  providedIn: HttpClientModule,
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_TYPE = 'user_type';

  isLoggedIn: boolean = false;
  userRole: string = '';

  private tokenSubject: BehaviorSubject<any | null>;
  private typeSubject: BehaviorSubject<any | null>;
  public user: Observable<any | null>;
  localStorage = this.document.defaultView?.localStorage;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    const storedToken = this.localStorage?.getItem(this.TOKEN_KEY);
    const storedType = this.localStorage?.getItem(this.USER_TYPE);
    this.tokenSubject = new BehaviorSubject<any | null>(
      storedToken ? JSON.parse(storedToken) : null
    );
    this.typeSubject = new BehaviorSubject<any | null>(
      storedType ? JSON.parse(storedType) : null
    );
    this.user = this.tokenSubject.asObservable();
  }

  public get userValue() {
    return this.tokenSubject.value;
  }

  login(login: Login): Observable<any> {
    return this.http.post<any>(`${environment.config.apiUrl}login`, login).pipe(
      map((login) => {
        this.localStorage?.setItem(this.TOKEN_KEY, JSON.stringify(login.token));
        this.localStorage?.setItem(this.USER_TYPE, JSON.stringify(login.type));
        this.tokenSubject.next(login.token);
        this.typeSubject.next(login.type);
        this.isLoggedIn = true;
        return login;
      })
    );
  }

  logout() {
    this.localStorage?.removeItem(this.TOKEN_KEY);
    this.localStorage?.removeItem(this.USER_TYPE);
    this.tokenSubject.next(null);
    this.typeSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuth() {
    return true;
    // if (this.tokenSubject.value) {
    //   this.isLoggedIn = true;
    //   return this.isLoggedIn;
    // } else {
    //   this.isLoggedIn = false;
    //   return this.isLoggedIn;
    // }
  }

  isRole(role: string): boolean {
    return this.userValue?.tipo == role;
  }

  isAdmin(): boolean {
    return this.isRole('ADMIN');
  }

  canEdit(): boolean {
    return !this.tokenSubject.value?.apenasVisualizacao || false;
  }

  userName(): string {
    return this.tokenSubject.value?.nome || '';
  }
}
