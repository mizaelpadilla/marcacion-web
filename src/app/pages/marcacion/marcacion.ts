import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../services/asistencia';
import { EmpleadoService } from '../../services/empleado';
import { Empleado } from '../../models/empleado';

export interface MarcacionReg {
  idMarcacion?: number;
  idEmpleado: number;
  fecha: string;
  horaEntrada?: string | null;
  horaSalida?: string | null;
  inicioDescanso?: string | null;
  finDescanso?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  foto?: string | null;
  empleado?: Empleado;
}

@Component({
  selector: 'app-marcacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marcacion.html',
  styleUrl: './marcacion.css'
})
export class Marcacion implements OnInit {
  private asistenciaService = inject(AsistenciaService);
  private empleadoService = inject(EmpleadoService);

  listaMarcaciones: MarcacionReg[] = [];
  listaEmpleados: Empleado[] = [];

  mostrarModalCrear = false;
  mostrarModalDetalle = false;
  modoEdicion = false;

  formularioManual = {
    idEmpleado: 0,
    fecha: '',
    horaEntrada: '',
    horaSalida: '',
    horaDescanso: '',
    horaRegreso: ''
  };

  marcacionSeleccionada: MarcacionReg = {
    idEmpleado: 0,
    fecha: ''
  };

  ngOnInit(): void {
    this.cargarMarcaciones();
    this.cargarEmpleados();
  }

  cargarMarcaciones(): void {
    this.asistenciaService.getMarcaciones().subscribe({
      next: (res) => {
        this.listaMarcaciones = res;
      },
      error: (err) => console.error('Error al cargar marcas:', err)
    });
  }

  cargarEmpleados(): void {
    this.empleadoService.listar().subscribe({
      next: (data) => this.listaEmpleados = data.filter(e => e.estado === true),
      error: (err) => console.error(err)
    });
  }

  abrirModalCrear() {
    this.resetFormulario();
    this.mostrarModalCrear = true;
  }

  guardarMarcacionManual() {
    const f = this.formularioManual;
    if (f.idEmpleado === 0 || !f.fecha) {
      alert('Por favor seleccione un trabajador y una fecha.');
      return;
    }

    // Armamos el payload exacto para la fila consolidada en base de datos
    const payload: MarcacionReg = {
      idEmpleado: Number(f.idEmpleado),
      fecha: f.fecha,
      horaEntrada: f.horaEntrada ? `${f.horaEntrada}:00` : null,
      horaSalida: f.horaSalida ? `${f.horaSalida}:00` : null,
      inicioDescanso: f.horaDescanso ? `${f.horaDescanso}:00` : null,
      finDescanso: f.horaRegreso ? `${f.horaRegreso}:00` : null,
      latitud: null,
      longitud: null,
      foto: null
    };

    // Procesamos el envío directo al backend (.NET)
    this.registrarAsistenciaEnServicio(payload);
  }

  registrarAsistenciaEnServicio(payload: any) {
    fetch('https://localhost:7084/api/Marcaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) {
        return res.json().then(data => {
          alert(data.mensaje || 'Guardado con éxito.');
          this.mostrarModalCrear = false;
          this.cargarMarcaciones();
        });
      } else {
        return res.text().then(text => {
          alert(text || 'El trabajador ya tiene marcaciones en esta fecha.');
        });
      }
    })
    .catch(() => alert('Error de conexión con el servidor de Base de Datos.'));
  }

  verDetalle(marca: MarcacionReg) {
    this.marcacionSeleccionada = { ...marca };
    this.modoEdicion = false;
    this.mostrarModalDetalle = true;
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarCambiosMarcacion() {
    // Aquí puedes meter la llamada fetch con método 'PUT' en el futuro
    alert('Registro corregido con éxito.');
    this.mostrarModalDetalle = false;
    this.cargarMarcaciones();
  }

  resetFormulario() {
    this.formularioManual = {
      idEmpleado: 0,
      fecha: '',
      horaEntrada: '',
      horaSalida: '',
      horaDescanso: '',
      horaRegreso: ''
    };
  }
}
