import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';
import { Horario } from '../../models/asistencia';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './horario.html',
  styleUrl: './horario.css'
})
export class Horarios implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private cd = inject(ChangeDetectorRef);

  listaHorarios: Horario[] = [];
  mostrarModal = false;
  modoEdicion = false;

  horarioSeleccionado: Horario = {
    idHorario: 0,
    nombreHorario: '',
    horaEntrada: '',
    horaSalida: '',
    horaRefrigerio: undefined,
    horaFinRefrigerio: undefined,
    toleranciaMinutos: 0
  };

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.asistenciaService.getHorarios().subscribe({
      next: (data) => {
        this.listaHorarios = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar horarios:', err)
    });
  }

  abrirModalCrear(): void {
    this.resetFormulario();
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  editar(h: Horario): void {
    this.horarioSeleccionado = { ...h };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardar(): void {
    if (!this.horarioSeleccionado.nombreHorario || !this.horarioSeleccionado.horaEntrada || !this.horarioSeleccionado.horaSalida) {
      alert('Nombre, Entrada y Salida son obligatorios.');
      return;
    }

    const formatearTimeSpan = (time: string | undefined) => {
      if (!time) return null;
      return time.split(':').length === 2 ? `${time}:00` : time;
    };

    const payload: Horario = {
      ...this.horarioSeleccionado,
      horaEntrada: formatearTimeSpan(this.horarioSeleccionado.horaEntrada)!,
      horaSalida: formatearTimeSpan(this.horarioSeleccionado.horaSalida)!,
      horaRefrigerio: formatearTimeSpan(this.horarioSeleccionado.horaRefrigerio) || undefined,
      horaFinRefrigerio: formatearTimeSpan(this.horarioSeleccionado.horaFinRefrigerio) || undefined
    };

    if (this.modoEdicion) {
      this.asistenciaService.editarHorario(payload.idHorario!, payload).subscribe({
        next: () => {
          alert('Horario actualizado');
          this.mostrarModal = false;
          this.cargarHorarios();
        },
        error: (err) => alert('Error al editar')
      });
    } else {
      this.asistenciaService.crearHorario(payload).subscribe({
        next: () => {
          alert('Horario creado');
          this.mostrarModal = false;
          this.cargarHorarios();
        },
        error: (err) => alert('Error al crear')
      });
    }
  }

  eliminar(id: number): void {
    if (confirm('¿Desactivar este horario?')) {
      this.asistenciaService.eliminarHorario(id).subscribe({
        next: () => this.cargarHorarios(),
        error: (err) => alert('Error al desactivar')
      });
    }
  }

  resetFormulario(): void {
    this.horarioSeleccionado = {
      idHorario: 0,
      nombreHorario: '',
      horaEntrada: '',
      horaSalida: '',
      horaRefrigerio: undefined,
      horaFinRefrigerio: undefined,
      toleranciaMinutos: 0
    };
  }
}
