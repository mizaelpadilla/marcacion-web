import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css'
})

export class Empleados implements OnInit {
  mostrarModal = false;
  modoEdicion = false;

  empleadoSeleccionado: Empleado = {
    idEmpleado: 0,
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    correo: '',
    estado: true
  };

  empleados: Empleado[] = [];

  constructor(
    private empleadoService: EmpleadoService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadoService.listar().subscribe({
      next: (data) => {
        // Ordenar para mostrar activos primero
        this.empleados = data.sort((a, b) => Number(b.estado) - Number(a.estado));
        this.cd.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  abrirModalNuevo() {
    this.empleadoSeleccionado = {
      idEmpleado: 0,
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      correo: '',
      estado: true
    };
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  editar(emp: Empleado) {
    this.empleadoSeleccionado = { ...emp };
    this.modoEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarCambios() {
    if (this.modoEdicion) {
      this.empleadoService.editar(this.empleadoSeleccionado).subscribe({
        next: () => {
          alert('Empleado actualizado');
          this.mostrarModal = false;
          this.cargarEmpleados();
        },
        error: (err) => alert('Error al actualizar')
      });
    } else {
      this.empleadoService.registrar(this.empleadoSeleccionado).subscribe({
        next: () => {
          alert('Empleado registrado');
          this.mostrarModal = false;
          this.cargarEmpleados();
        },
        error: (err) => alert('Error al registrar')
      });
    }
  }

  eliminar(id: number) {
    if (!confirm('¿Desea marcar como inactivo a este empleado?')) return;

    this.empleadoService.eliminar(id).subscribe({
      next: () => {
        alert('Estado actualizado');
        this.cargarEmpleados();
      },
      error: (err) => alert('Error al procesar')
    });
  }
}
