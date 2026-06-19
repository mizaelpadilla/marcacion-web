import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, RegistrarUsuarioDto } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7084/api/usuario';

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  activarUsuario(dto: RegistrarUsuarioDto): Observable<string> {
    return this.http.post(`${this.apiUrl}/activar`, dto, { responseType: 'text' });
  }
}
