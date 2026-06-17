import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Empleados } from './pages/empleados/empleados';
import { Usuarios } from './pages/usuarios/usuarios';
import { Horario } from './pages/horario/horario';
import { Marcacion } from './pages/marcacion/marcacion';
export const routes: Routes = [

  { path: '', component: Login },

  { path: 'dashboard', component: Dashboard },

  { path: 'empleados', component: Empleados },

  { path: 'usuarios', component: Usuarios },

  { path: 'horarios', component: Horario },

  { path: 'marcaciones', component: Marcacion },

];
