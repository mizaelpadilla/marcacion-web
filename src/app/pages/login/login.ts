import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  usuario = '';
  clave = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion() {

    const datos = {
      usuario: this.usuario,
      clave: this.clave
    };

    this.authService.login(datos).subscribe({

      next: (resp:any) => {

        localStorage.setItem(
          'usuario',
          JSON.stringify(resp)
        );

        this.router.navigate(['/dashboard']);
      },

      error: () => {
        alert('Usuario o contraseña incorrectos');
      }

    });

  }

}
