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

        console.log('Datos recibidos:', data);

        this.empleados = [...data];

        this.cd.detectChanges();

      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  editar(emp: Empleado) {

  this.empleadoSeleccionado = {
    ...emp
  };

  this.mostrarModal = true;

}

cerrarModal() {

  this.mostrarModal = false;

}

guardarCambios() {

  this.empleadoService
    .editar(this.empleadoSeleccionado)
    .subscribe({

      next: () => {

        alert('Empleado actualizado');

        this.mostrarModal = false;

        this.cargarEmpleados();

      },

      error: (err) => {

        console.error(err);

        alert('Error al actualizar');

      }

    });

}

eliminar(id: number) {

  if (!confirm('¿Desea eliminar este empleado?')) {
    return;
  }

  this.empleadoService
    .eliminar(id)
    .subscribe({

      next: () => {

        alert('Empleado eliminado');

        this.cargarEmpleados();

      },

      error: (err) => {

        console.error(err);

        alert('Error al eliminar');

      }

    });
  }
}
