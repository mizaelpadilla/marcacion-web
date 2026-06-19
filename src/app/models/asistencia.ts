export interface Horario {
  idHorario?: number;
  nombreHorario: string;
  horaEntrada: string;
  horaSalida: string;
  horaRefrigerio?: string;
  horaFinRefrigerio?: string;
  toleranciaMinutos: number;
}

export interface Turno {
  idTurno?: number;
  nombreTurno: string;
  idHorarioLunes?: number | null;
  idHorarioMartes?: number | null;
  idHorarioMiercoles?: number | null;
  idHorarioJueves?: number | null;
  idHorarioViernes?: number | null;
  idHorarioSabado?: number | null;
  idHorarioDomingo?: number | null;

  horarioLunes?: Horario;
  horarioMartes?: Horario;
  horarioMiercoles?: Horario;
  horarioJueves?: Horario;
  horarioViernes?: Horario;
  horarioSabado?: Horario;
  horarioDomingo?: Horario;
}

export interface Planificacion {
  idPlanificacion?: number;
  idEmpleado: number;
  idTurno: number;
  fechaInicio: string; // Formato yyyy-MM-dd
  fechaFin: string;
  estado?: boolean;

  empleado?: any;
  turno?: Turno;
}
