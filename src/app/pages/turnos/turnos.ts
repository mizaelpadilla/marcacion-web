import { Component, OnInit, inject } from '@angular/core';
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

  listaTurnos: Turno[] = [];
  listaHorarios: Horario[] = [];
  mostrarModalCrear = false;

  // Modelo para mapear el formulario conforme al backend
  nuevoTurno: Turno = {
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
      next: (data) => this.listaTurnos = data,
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarHorarios(): void {
    this.asistenciaService.getHorarios().subscribe({
      next: (data) => this.listaHorarios = data,
      error: (err) => console.error('Error al cargar horarios para los selectores:', err)
    });
  }

  abrirModalCrear(): void {
    this.resetFormulario();
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  guardarTurno(): void {
    if (!this.nuevoTurno.nombreTurno) {
      alert('Por favor, asigne un nombre al turno.');
      return;
    }

    // Conversión limpia: si seleccionan "Descanso" (value original null/cadena vacía), enviamos null a .NET
    const limpiarId = (value: any) => {
      return value === 'null' || value === null || value === '' ? null : Number(value);
    };

    const turnoPayload: Turno = {
      nombreTurno: this.nuevoTurno.nombreTurno,
      idHorarioLunes: limpiarId(this.nuevoTurno.idHorarioLunes),
      idHorarioMartes: limpiarId(this.nuevoTurno.idHorarioMartes),
      idHorarioMiercoles: limpiarId(this.nuevoTurno.idHorarioMiercoles),
      idHorarioJueves: limpiarId(this.nuevoTurno.idHorarioJueves),
      idHorarioViernes: limpiarId(this.nuevoTurno.idHorarioViernes),
      idHorarioSabado: limpiarId(this.nuevoTurno.idHorarioSabado),
      idHorarioDomingo: limpiarId(this.nuevoTurno.idHorarioDomingo)
    };

    this.asistenciaService.crearTurno(turnoPayload).subscribe({
      next: (res) => {
        alert(res.mensaje || 'Turno creado con éxito');
        this.mostrarModalCrear = false;
        this.cargarTurnos();
      },
      error: (err) => alert(err.error || 'Error al intentar guardar el turno.')
    });
  }

  resetFormulario(): void {
    this.nuevoTurno = {
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
