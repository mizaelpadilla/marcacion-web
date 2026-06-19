import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarcacionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Marcaciones`;

  getMarcaciones(limit: number = 100): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?limit=${limit}`);
  }

  getReporte(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Reporte`);
  }

  registrar(marcacion: any): Observable<any> {
    return this.http.post(this.apiUrl, marcacion);
  }

  editar(id: number, marcacion: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, marcacion);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
