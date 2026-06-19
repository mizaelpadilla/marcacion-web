import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';
import { EmpleadoService } from '../../services/empleado'; // <-- Inyectamos tu servicio real
import { Turno, Planificacion } from '../../models/asistencia';
import { Empleado } from '../../models/empleado'; // <-- Importamos tu interfaz Empleado

@Component({
  selector: 'app-planificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planificacion.html',
  styleUrl: './planificacion.css'
})
export class Planificaciones implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private empleadoService = inject(EmpleadoService); // <-- Inyección limpia del servicio

  listaPlanificaciones: Planificacion[] = [];
  listaTurnos: Turno[] = [];
  listaEmpleados: Empleado[] = []; // <-- Cambiado de any[] a Empleado[]
  mostrarModalCrear = false;

  nuevoPlan: Planificacion = {
    idEmpleado: 0,
    idTurno: 0,
    fechaInicio: '',
    fechaFin: ''
  };

  ngOnInit(): void {
    this.cargarPlanificaciones();
    this.cargarTurnos();
    this.cargarEmpleados();
  }

  cargarPlanificaciones(): void {
    this.asistenciaService.getPlanificaciones().subscribe({
      next: (data) => this.listaPlanificaciones = data,
      error: (err) => console.error('Error al cargar planificaciones:', err)
    });
  }

  cargarTurnos(): void {
    this.asistenciaService.getTurnos().subscribe({
      next: (data) => this.listaTurnos = data,
      error: (err) => console.error('Error al cargar turnos:', err)
    });
  }

  cargarEmpleados(): void {
    // Llamamos a tu servicio real de la base de datos
    this.empleadoService.listar().subscribe({
      next: (data) => {
        // Filtramos para asignar turnos solo a empleados activos
        this.listaEmpleados = data.filter(emp => emp.estado === true);
      },
      error: (err) => console.error('Error al cargar empleados reales:', err)
    });
  }

  abrirModalCrear(): void {
    this.resetFormulario();
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
  }

  guardarPlanificacion(): void {
    if (!this.nuevoPlan.idEmpleado || !this.nuevoPlan.idTurno || !this.nuevoPlan.fechaInicio || !this.nuevoPlan.fechaFin) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (new Date(this.nuevoPlan.fechaInicio) > new Date(this.nuevoPlan.fechaFin)) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    this.asistenciaService.crearPlanificacion(this.nuevoPlan).subscribe({
      next: (res) => {
        alert(res.mensaje || 'Planificación guardada con éxito.');
        this.mostrarModalCrear = false;
        this.cargarPlanificaciones();
      },
      error: (err) => alert(err.error || 'Error al guardar la planificación.')
    });
  }

  resetFormulario(): void {
    this.nuevoPlan = {
      idEmpleado: 0,
      idTurno: 0,
      fechaInicio: '',
      fechaFin: ''
    };
  }
}
