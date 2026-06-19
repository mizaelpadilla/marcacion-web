import { Component, OnInit, inject } from '@angular/core';
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

  listaHorarios: Horario[] = [];
  mostrarModalCrear = false;

  nuevoHorario: Horario = {
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
      console.log('Datos recibidos de la API:', data); // <-- Agrega este log para espiar qué responde .NET
      this.listaHorarios = data;
    },
    error: (err) => console.error('Error al traer horarios:', err)
  });
}

  abrirModalCrear(): void {
    this.resetFormulario();
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  guardarHorario(): void {
    if (!this.nuevoHorario.nombreHorario || !this.nuevoHorario.horaEntrada || !this.nuevoHorario.horaSalida) {
      alert('Por favor, rellene los campos obligatorios (Nombre, Entrada y Salida).');
      return;
    }

    const formatearTimeSpan = (time: string | undefined) => {
      if (!time) return null;
      return time.split(':').length === 2 ? `${time}:00` : time;
    };

    const horarioPayload: Horario = {
      ...this.nuevoHorario,
      horaEntrada: formatearTimeSpan(this.nuevoHorario.horaEntrada)!,
      horaSalida: formatearTimeSpan(this.nuevoHorario.horaSalida)!,
      horaRefrigerio: formatearTimeSpan(this.nuevoHorario.horaRefrigerio) || undefined,
      horaFinRefrigerio: formatearTimeSpan(this.nuevoHorario.horaFinRefrigerio) || undefined
    };

    this.asistenciaService.crearHorario(horarioPayload).subscribe({
      next: (res) => {
        alert(res.mensaje);
        this.mostrarModalCrear = false;
        this.cargarHorarios();
      },
      error: (err) => alert(err.error || 'Error al intentar guardar el horario.')
    });
  }

  resetFormulario(): void {
    this.nuevoHorario = {
      nombreHorario: '',
      horaEntrada: '',
      horaSalida: '',
      horaRefrigerio: undefined,
      horaFinRefrigerio: undefined,
      toleranciaMinutos: 0
    };
  }
}
