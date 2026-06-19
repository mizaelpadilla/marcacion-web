import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarcacionService } from '../../services/marcacion';
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
  private marcacionService = inject(MarcacionService);
  private empleadoService = inject(EmpleadoService);
  private cd = inject(ChangeDetectorRef);

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
    this.marcacionService.getMarcaciones().subscribe({
      next: (res: any[]) => {
        console.log('Marcaciones cargadas:', res);
        this.listaMarcaciones = res && res.length > 0 ? [...res] : [];
        this.cd.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar marcas:', err)
    });
  }

  cargarEmpleados(): void {
    this.empleadoService.listar().subscribe({
      next: (data: Empleado[]) => {
        this.listaEmpleados = data.filter(e => e.estado === true);
        this.cd.detectChanges();
      },
      error: (err: any) => console.error(err)
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

    const payload: any = {
      idEmpleado: Number(f.idEmpleado),
      fecha: f.fecha,
      horaEntrada: f.horaEntrada ? `${f.horaEntrada}:00` : null,
      horaSalida: f.horaSalida ? `${f.horaSalida}:00` : null,
      inicioDescanso: f.horaDescanso ? `${f.horaDescanso}:00` : null,
      finDescanso: f.horaRegreso ? `${f.horaRegreso}:00` : null
    };

    console.log('Enviando marcación manual:', payload);

    this.marcacionService.registrar(payload).subscribe({
      next: (res: any) => {
        console.log('Respuesta exitosa del servidor:', res);
        alert(res.mensaje || 'Guardado con éxito.');
        this.mostrarModalCrear = false;
        this.cargarMarcaciones();
      },
      error: (err: any) => {
        console.error('Error al registrar marcación:', err);
        const msg = err.error?.mensaje || err.error || 'El trabajador ya tiene marcaciones en esta fecha o error en el servidor.';
        alert(msg);
      }
    });
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
    this.marcacionService.editar(this.marcacionSeleccionada.idMarcacion!, this.marcacionSeleccionada).subscribe({
      next: () => {
        alert('Registro corregido con éxito.');
        this.mostrarModalDetalle = false;
        this.cargarMarcaciones();
      },
      error: () => alert('Error al actualizar registro.')
    });
  }

  eliminar(id: number) {
    if (confirm('¿Desea desactivar este registro de asistencia?')) {
      this.marcacionService.eliminar(id).subscribe({
        next: () => this.cargarMarcaciones(),
        error: () => alert('Error al eliminar.')
      });
    }
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
