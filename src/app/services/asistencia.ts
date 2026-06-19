import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario, Turno, Planificacion } from '../models/asistencia';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // --- HORARIOS ---
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/Horarios`);
  }

  crearHorario(horario: Horario): Observable<any> {
    return this.http.post(`${this.apiUrl}/Horarios`, horario);
  }

  editarHorario(id: number, horario: Horario): Observable<any> {
    return this.http.put(`${this.apiUrl}/Horarios/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Horarios/${id}`);
  }

  // --- TURNOS ---
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/Turnos`);
  }

  crearTurno(turno: Turno): Observable<any> {
    return this.http.post(`${this.apiUrl}/Turnos`, turno);
  }

  editarTurno(id: number, turno: Turno): Observable<any> {
    return this.http.put(`${this.apiUrl}/Turnos/${id}`, turno);
  }

  eliminarTurno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Turnos/${id}`);
  }

  // --- PLANIFICACIONES ---
  getPlanificaciones(): Observable<Planificacion[]> {
    return this.http.get<Planificacion[]>(`${this.apiUrl}/Planificaciones`);
  }

  crearPlanificacion(planificacion: Planificacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/Planificaciones`, planificacion);
  }

  editarPlanificacion(id: number, planificacion: Planificacion): Observable<any> {
    return this.http.put(`${this.apiUrl}/Planificaciones/${id}`, planificacion);
  }

  eliminarPlanificacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Planificaciones/${id}`);
  }

  // --- MARCACIONES ---
  getMarcaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Marcaciones`);
  }

  crearMarcacionesMasivas(marcas: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/Marcaciones/Masivo`, marcas);
  }

  getReporteMarcaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Marcaciones/Reporte`);
  }
}
