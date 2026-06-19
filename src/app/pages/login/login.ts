import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  clave = '';
  verClave = false;
  cargando = false;

  iniciarSesion() {
    if (!this.usuario || !this.clave) return;

    this.cargando = true;
    const datos = {
      usuario: this.usuario.trim(),
      clave: this.clave.trim()
    };

    console.log('Iniciando intento de login para:', datos.usuario);

    this.authService.login(datos)
      .pipe(
        finalize(() => {
          this.cargando = false;
          console.log('Proceso de login finalizado (UI desbloqueada)');
        })
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Login exitoso:', resp);
          localStorage.setItem('usuario', JSON.stringify(resp));
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error detallado de login:', err);

          let mensaje = 'No se pudo conectar con el servidor. Verifique su conexión.';
          if (err.status === 401) {
            mensaje = 'Usuario o contraseña incorrectos';
          } else if (err.status === 0) {
            mensaje = 'Error de red o certificado SSL. Por favor, autorice la API en el navegador.';
          }

          alert(mensaje);
        }
      });
  }
}
