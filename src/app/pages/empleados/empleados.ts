import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empleados.html'
})
export class Empleados implements OnInit {

  empleados: Empleado[] = [];

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empleadoService.listar()
      .subscribe(data => {
        this.empleados = data;
      });
  }
}
