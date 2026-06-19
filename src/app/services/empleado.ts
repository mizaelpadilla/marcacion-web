import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Empleados`;

  // LISTAR
  listar(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  // BUSCAR POR ID
  buscar(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(
      `${this.apiUrl}/${id}`
    );
  }

  // REGISTRAR
  registrar(
    empleado: Empleado
  ): Observable<any> {
    return this.http.post(
      this.apiUrl,
      empleado
    );
  }

  // EDITAR
  editar(
    empleado: Empleado
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${empleado.idEmpleado}`,
      empleado
    );
  }

  // ELIMINAR
  eliminar(
    id: number
  ): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  cambiarEstado(id: number): Observable<Empleado> {
    return this.http.patch<Empleado>(`${this.apiUrl}/estado/${id}`, {});
  }
}
