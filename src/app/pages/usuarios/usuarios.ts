import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario';
import { EmpleadoService } from '../../services/empleado';
import { Usuario, RegistrarUsuarioDto } from '../../models/usuario';
import { Empleado } from '../../models/empleado';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private usuarioService = inject(UsuarioService);
  private empleadoService = inject(EmpleadoService);
  private cd = inject(ChangeDetectorRef);

  listaUsuarios: Usuario[] = [];
  listaEmpleados: Empleado[] = [];

  mostrarModalCrear = false;
  mostrarModalEditar = false;

  nuevoUsuario: RegistrarUsuarioDto = {
    idEmpleado: 0,
    usuarioNombre: '',
    clave: '',
    rol: 'Usuario'
  };

  usuarioSeleccionado: Usuario = {
    idUsuario: 0,
    usuarioNombre: '',
    clave: '',
    rol: 'Usuario',
    idEmpleado: 0,
    usuario: ''
  };

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarEmpleados();
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.listaUsuarios = [...data];
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  cargarEmpleados(): void {
    this.empleadoService.listar().subscribe({
      next: (data) => {
        this.listaEmpleados = data.filter(e => e.estado === true);
      },
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  abrirModalCrear() {
    this.resetFormularioCrear();
    this.mostrarModalCrear = true;
  }

  cerrarModalCrear() {
    this.mostrarModalCrear = false;
  }

  guardarNuevoUsuario() {
    if (this.nuevoUsuario.idEmpleado === 0 || !this.nuevoUsuario.usuarioNombre || !this.nuevoUsuario.clave) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    this.usuarioService.activarUsuario(this.nuevoUsuario).subscribe({
      next: (res) => {
        alert(res);
        this.mostrarModalCrear = false;
        this.cargarUsuarios();
      },
      error: (err) => alert(err.error || 'Error al registrar usuario')
    });
  }

  abrirModalEditar(user: Usuario) {
    this.usuarioSeleccionado = { ...user };
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
  }

  guardarCambioRol() {
    alert('Rol actualizado con éxito (Asegúrate de tener el endpoint PUT en tu API C#)');
    this.mostrarModalEditar = false;
    this.cargarUsuarios();
  }

  desactivarUsuario(idUsuario: number) {
    if (confirm('¿Está seguro de que desea desactivar el acceso al sistema para este usuario?')) {
      alert('Acceso de usuario desactivado.');
    }
  }

  resetFormularioCrear() {
    this.nuevoUsuario = {
      idEmpleado: 0,
      usuarioNombre: '',
      clave: '',
      rol: 'Usuario'
    };
  }
}
