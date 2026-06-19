import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Horario, Turno, Planificacion } from '../models/asistencia';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7084/api'; // Corregido el ;;

  // --- HORARIOS ---
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/Horarios`);
  }

  crearHorario(horario: Horario): Observable<any> {
    return this.http.post(`${this.apiUrl}/Horarios`, horario);
  }

  // --- TURNOS ---
  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/Turnos`);
  }

  crearTurno(turno: Turno): Observable<any> {
    return this.http.post(`${this.apiUrl}/Turnos`, turno);
  }

  // --- PLANIFICACIONES ---
  getPlanificaciones(): Observable<Planificacion[]> {
    return this.http.get<Planificacion[]>(`${this.apiUrl}/Planificaciones`);
  }

  crearPlanificacion(planificacion: Planificacion): Observable<any> {
    return this.http.post(`${this.apiUrl}/Planificaciones`, planificacion);
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
