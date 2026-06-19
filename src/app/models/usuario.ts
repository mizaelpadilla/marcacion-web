export interface Usuario {
  idUsuario: number;
  usuarioNombre: string;
  usuario: string;
  clave: string;
  rol: string;
  idEmpleado: number;
}

export interface RegistrarUsuarioDto {
  idEmpleado: number;
  usuarioNombre: string;
  clave: string;
  rol: string;
}
