import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';
import { Horario, Turno } from '../../models/asistencia';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.html',
  styleUrl: './turnos.css'
})
export class Turnos implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private cd = inject(ChangeDetectorRef);

  listaTurnos: Turno[] = [];
  listaHorarios: Horario[] = [];
  mostrarModal = false;
  modoEdicion = false;

  turnoSeleccionado: Turno = {
    idTurno: 0,
    nombreTurno: '',
    idHorarioLunes: null,
    idHorarioMartes: null,
    idHorarioMiercoles: null,
    idHorarioJueves: null,
    idHorarioViernes: null,
    idHorarioSabado: null,
    idHorarioDomingo: null
  };

  ngOnInit(): void {
    this.cargarTurnos();
    this.cargarHorarios();
  }

  cargarTurnos(): void {
    this.asistenciaService.getTurnos().subscribe({
      next: (data) => {
        this.listaTurnos = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarHorarios(): void {
    this.asistenciaService.getHorarios().subscribe({
      next: (data) => this.listaHorarios = data,
      error: (err) => console.error('Error al cargar horarios:', err)
    });
  }

  abrirModalCrear(): void {
    this.resetFormulario();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  editar(t: Turno): void {
    this.turnoSeleccionado = { ...t };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (!this.turnoSeleccionado.nombreTurno) {
      alert('Nombre de turno es obligatorio.');
      return;
    }

    const limpiarId = (v: any) => (v === 'null' || v === null || v === '') ? null : Number(v);

    const payload: Turno = {
      ...this.turnoSeleccionado,
      idHorarioLunes: limpiarId(this.turnoSeleccionado.idHorarioLunes),
      idHorarioMartes: limpiarId(this.turnoSeleccionado.idHorarioMartes),
      idHorarioMiercoles: limpiarId(this.turnoSeleccionado.idHorarioMiercoles),
      idHorarioJueves: limpiarId(this.turnoSeleccionado.idHorarioJueves),
      idHorarioViernes: limpiarId(this.turnoSeleccionado.idHorarioViernes),
      idHorarioSabado: limpiarId(this.turnoSeleccionado.idHorarioSabado),
      idHorarioDomingo: limpiarId(this.turnoSeleccionado.idHorarioDomingo)
    };

    if (this.modoEdicion) {
      this.asistenciaService.editarTurno(payload.idTurno!, payload).subscribe({
        next: () => {
          alert('Turno actualizado');
          this.mostrarModal = false;
          this.cargarTurnos();
        },
        error: (err) => alert('Error al editar')
      });
    } else {
      this.asistenciaService.crearTurno(payload).subscribe({
        next: () => {
          alert('Turno creado');
          this.mostrarModal = false;
          this.cargarTurnos();
        },
        error: (err) => alert('Error al crear')
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Desactivar este turno?')) {
      this.asistenciaService.eliminarTurno(id).subscribe({
        next: () => this.cargarTurnos(),
        error: (err) => alert('Error al desactivar')
      });
    }
  }

  resetFormulario(): void {
    this.turnoSeleccionado = {
      idTurno: 0,
      nombreTurno: '',
      idHorarioLunes: null,
      idHorarioMartes: null,
      idHorarioMiercoles: null,
      idHorarioJueves: null,
      idHorarioViernes: null,
      idHorarioSabado: null,
      idHorarioDomingo: null
    };
  }
}
