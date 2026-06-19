import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private router = inject(Router);

  protected readonly title = signal('marcacion-web');
  mostrarLayout = false;
  usuarioLogueado: any = null;
  primerNombre: string = '';

  ngOnInit(): void {
    // Escuchar cambios de ruta para decidir si mostrar el Sidebar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.mostrarLayout = url !== '/' && url !== '';

      if (this.mostrarLayout) {
        this.cargarUsuario();
      }
    });

    // Carga inicial
    this.cargarUsuario();
  }

  cargarUsuario() {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuarioLogueado = JSON.parse(userStr);
      const nombreCompleto = this.usuarioLogueado.usuarioNombre || 'Admin';
      this.primerNombre = nombreCompleto.split(' ')[0];
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.usuarioLogueado = null;
    this.router.navigate(['/']);
  }
}
