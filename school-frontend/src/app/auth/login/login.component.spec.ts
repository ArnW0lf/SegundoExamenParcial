import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent], // Standalone component
            providers: [
                FormBuilder,
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: MatSnackBar, useValue: snackBarSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call AuthService.login on submit', () => {
        component.loginForm.setValue({ username: 'test', password: '1234' });
        authServiceSpy.login.and.returnValue(of({ access: 'dummy-access-token' }));

        component.onSubmit();

        expect(authServiceSpy.login).toHaveBeenCalledWith('test', '1234');
    });

    it('should navigate to /dashboard for admin user', () => {
        component.loginForm.setValue({ username: 'adminUser', password: '1234' });
        authServiceSpy.login.and.returnValue(of({ access: 'dummy-access-token' }));

        component.onSubmit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should navigate to /my-courses for non-admin user', () => {
        component.loginForm.setValue({ username: 'student', password: '1234' });
        authServiceSpy.login.and.returnValue(of({ access: 'dummy-access-token' }));

        component.onSubmit();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-courses']);
    });

    it('should show error snackbar on login error', () => {
        component.loginForm.setValue({ username: 'test', password: 'wrong' });
        authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

        component.onSubmit();

        expect(snackBarSpy.open).toHaveBeenCalledWith(
            'Error al iniciar sesión. Por favor, verifica tus credenciales.',
            'Cerrar',
            { duration: 5000 }
        );
        expect(component.isLoading).toBeFalse();
    });
});