import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';
import { EmpleadoService } from '../../services/empleado';
import { Planificacion, Turno } from '../../models/asistencia';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-planificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planificacion.html',
  styleUrl: './planificacion.css'
})
export class Planificaciones implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private empleadoService = inject(EmpleadoService);
  private cd = inject(ChangeDetectorRef);

  listaPlanificaciones: Planificacion[] = [];
  listaEmpleados: Empleado[] = [];
  listaTurnos: Turno[] = [];
  mostrarModal = false;
  modoEdicion = false;

  planSeleccionada: Planificacion = {
    idPlanificacion: 0,
    idEmpleado: 0,
    idTurno: 0,
    fechaInicio: '',
    fechaFin: '',
    estado: true
  };

  ngOnInit(): void {
    this.cargarPlanificaciones();
    this.cargarDatosMaestros();
  }

  cargarPlanificaciones(): void {
    this.asistenciaService.getPlanificaciones().subscribe({
      next: (data) => {
        this.listaPlanificaciones = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  cargarDatosMaestros(): void {
    this.empleadoService.listar().subscribe(data => this.listaEmpleados = data);
    this.asistenciaService.getTurnos().subscribe(data => this.listaTurnos = data);
  }

  abrirModalCrear(): void {
    this.planSeleccionada = { idPlanificacion: 0, idEmpleado: 0, idTurno: 0, fechaInicio: '', fechaFin: '', estado: true };
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  editar(p: Planificacion): void {
    this.planSeleccionada = { ...p };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (!this.planSeleccionada.idEmpleado || !this.planSeleccionada.idTurno || !this.planSeleccionada.fechaInicio) {
      alert('Empleado, Turno e Inicio son obligatorios.');
      return;
    }

    if (this.modoEdicion) {
      this.asistenciaService.editarPlanificacion(this.planSeleccionada.idPlanificacion!, this.planSeleccionada).subscribe({
        next: () => {
          alert('Planificación actualizada');
          this.mostrarModal = false;
          this.cargarPlanificaciones();
        },
        error: (err) => alert('Error al editar')
      });
    } else {
      this.asistenciaService.crearPlanificacion(this.planSeleccionada).subscribe({
        next: () => {
          alert('Planificación creada');
          this.mostrarModal = false;
          this.cargarPlanificaciones();
        },
        error: (err) => alert('Error al crear')
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Desactivar esta planificación?')) {
      this.asistenciaService.eliminarPlanificacion(id).subscribe({
        next: () => this.cargarPlanificaciones(),
        error: (err) => alert('Error al desactivar')
      });
    }
  }
}
