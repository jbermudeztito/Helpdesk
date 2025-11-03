export interface Oficina {
  ID_OFICINA: number;
  TIPO: 'LIMA' | 'PRINCIPAL' | 'PROVINCIA';
  CODIGO?: string;
  NOMBRE: string;
  DEPARTAMENTO?: string;
  PROVINCIA?: string;
  DISTRITO?: string;
  DIRECCION?: string;
  TELEFONO?: string;
  ACTIVA?: 'S' | 'N';
}

export interface Usuario {
  ID_USUARIO: number;
  NOMBRE: string;
  EMAIL: string;
  TELEFONO?: string;
  ID_OFICINA: number;
}

export interface Agente {
  ID_AGENTE: number;
  ID_USUARIO: number;
  ROL: 'Soporte N1' | 'Soporte N2' | 'Administrador';
  ACTIVO: 'S' | 'N';
}

export interface AreaAtencion {
  ID_AREA: number;
  NOMBRE: string;
  DESCRIPCION?: string;
}

export interface Subcategoria {
  ID_SUBCATEGORIA: number;
  ID_AREA: number;
  NOMBRE: string;
  DESCRIPCION?: string;
}

export interface Prioridad {
  ID_PRIORIDAD: number;
  NOMBRE: 'Baja' | 'Media' | 'Alta' | 'Urgente';
  DESCRIPCION?: string;
  NIVEL: number;
}

export interface TipoTicket {
  ID_TIPO_TICKET: number;
  NOMBRE: 'Consulta' | 'Incidencia' | 'Requerimiento';
  DESCRIPCION?: string;
}

export interface Ticket {
  ID_TICKET: number;
  ID_USUARIO: number;
  ID_AREA: number;
  ID_SUBCATEGORIA: number;
  ID_TIPO_TICKET: number;
  ID_PRIORIDAD: number;
  ID_OFICINA: number;
  TITULO: string;
  DESCRIPCION: string;
  ESTADO: 'Nuevo' | 'Asignado' | 'En Progreso' | 'En Espera' | 'Resuelto' | 'Cerrado' | 'Escalado' | 'Reabierto';
  FECHA_CREACION: string;
  FECHA_ACTUALIZACION: string;
  FECHA_CIERRE?: string;
}

export interface Comentario {
  ID_COMENTARIO: number;
  ID_TICKET: number;
  ID_USUARIO: number;
  MENSAJE: string;
  FECHA: string;
}

export interface TicketAdjunto {
  ID_ADJUNTO: number;
  ID_TICKET: number;
  NOMBRE_ARCHIVO: string;
  URL_ARCHIVO: string;
}

export interface TicketHistorial {
    ID_HISTORIAL: number;
    ID_TICKET: number;
    CAMPO_CAMBIADO: string;
    VALOR_ANTERIOR: string;
    VALOR_NUEVO: string;
    FECHA_CAMBIO: string;
    ID_USUARIO: number;
}

export interface GeminiSuggestions {
  areaId: number;
  subcategoryId: number;
  priorityId: number;
  typeId: number;
}

export interface TicketAgente {
  ID_TICKET: number;
  ID_AGENTE: number;
  ROL_EN_TICKET: 'Principal' | 'Secundario' | 'Colaborador';
  FECHA_ASIGNACION: string;
  ACTIVO: 'S' | 'N';
}

export interface AgenteArea {
    ID_AGENTE: number;
    ID_AREA: number;
    ACTIVO: 'S' | 'N';
}