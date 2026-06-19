import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EmpleadoService } from '../../services/empleado';
import { MarcacionService } from '../../services/marcacion';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private marcacionService = inject(MarcacionService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  usuarioLogueado: any = null;
  primerNombre: string = '';
  totalColaboradores: number = 0;
  activos: number = 0;
  inactivos: number = 0;
  marcacionesRecientes: any[] = [];

  ngOnInit(): void {
    const userStr = localStorage.getItem('usuario');
    if (userStr) {
      this.usuarioLogueado = JSON.parse(userStr);
      const nombreCompleto = this.usuarioLogueado.usuarioNombre || 'Admin';
      this.primerNombre = nombreCompleto.split(' ')[0];
    } else {
      this.router.navigate(['/']);
    }

    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.empleadoService.listar().subscribe({
      next: (data) => {
        this.totalColaboradores = data.length;
        this.activos = data.filter(e => e.estado).length;
        this.inactivos = data.filter(e => !e.estado).length;
        this.cd.detectChanges();
      }
    });

    this.marcacionService.getMarcaciones().subscribe({
      next: (data) => {
        this.marcacionesRecientes = [...data].slice(0, 5);
        this.cd.detectChanges();
      }
    });
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/']);
  }
}
