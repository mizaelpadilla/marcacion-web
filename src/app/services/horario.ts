import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7084/api/Horarios';

  getHorarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  crearHorario(horario: any): Observable<any> {
    return this.http.post(this.apiUrl, horario);
  }

  editarHorario(id: number, horario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, horario);
  }

  eliminarHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
