import type { Ticket, AreaAtencion, Subcategoria, Prioridad, TipoTicket, Usuario, Agente, Oficina, Comentario, TicketAgente, TicketHistorial } from './types';

export const MOCK_OFICINAS: Oficina[] = [
  { ID_OFICINA: 1, TIPO: 'LIMA', NOMBRE: 'OFICINA NIÑO', ACTIVA: 'S' },
  { ID_OFICINA: 2, TIPO: 'LIMA', NOMBRE: 'OFICINA PUENTE PIEDRA', ACTIVA: 'S' },
  { ID_OFICINA: 3, TIPO: 'LIMA', NOMBRE: 'OFICINA RED RIMAC', ACTIVA: 'S' },
  { ID_OFICINA: 4, TIPO: 'LIMA', NOMBRE: 'OFICINA RED TUPAC AMARU', ACTIVA: 'S' },
  { ID_OFICINA: 5, TIPO: 'LIMA', NOMBRE: 'OFICINA RED VILLA EL SALVADOR', ACTIVA: 'S' },
  { ID_OFICINA: 6, TIPO: 'LIMA', NOMBRE: 'OFICINA SAN JOSE', ACTIVA: 'S' },
  { ID_OFICINA: 7, TIPO: 'LIMA', NOMBRE: 'OFICINA SAN JUAN', ACTIVA: 'S' },
  { ID_OFICINA: 8, TIPO: 'LIMA', NOMBRE: 'OFICINA SANTA ROSA', ACTIVA: 'S' },
  // FIX: Corrected typo from ID_OFICina to ID_OFICINA.
  { ID_OFICINA: 9, TIPO: 'LIMA', NOMBRE: 'OFICINA SJL', ACTIVA: 'S' },
  { ID_OFICINA: 10, TIPO: 'LIMA', NOMBRE: 'OFICINA VALDIZAN', ACTIVA: 'S' },
  { ID_OFICINA: 11, TIPO: 'LIMA', NOMBRE: 'OFICINA VENTANILLA', ACTIVA: 'S' },
  { ID_OFICINA: 12, TIPO: 'LIMA', NOMBRE: 'REGION COMERCIAL', ACTIVA: 'S' },
  { ID_OFICINA: 13, TIPO: 'PRINCIPAL', NOMBRE: 'OFICINA PRINCIPAL', ACTIVA: 'S' },
  { ID_OFICINA: 14, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA ABANCAY', ACTIVA: 'S' },
  { ID_OFICINA: 15, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA ANDAHUAYLAS', ACTIVA: 'S' },
  { ID_OFICINA: 16, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA AREQUIPA', ACTIVA: 'S' },
  { ID_OFICINA: 17, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA AYACUCHO', ACTIVA: 'S' },
  { ID_OFICINA: 18, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA BARRANCA', ACTIVA: 'S' },
  { ID_OFICINA: 19, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA CAJAMARCA', ACTIVA: 'S' },
  { ID_OFICINA: 20, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA CAÑETE', ACTIVA: 'S' },
  { ID_OFICINA: 21, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA CERRO DE PASCO', ACTIVA: 'S' },
  { ID_OFICINA: 22, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA CHACHAPOYAS', ACTIVA: 'S' },
  { ID_OFICINA: 23, TIPO: 'PROVINCIA', NOMBRE: 'OFICINA CHANCAY', ACTIVA: 'S' },
];

export const MOCK_USUARIOS: Usuario[] = [
  { ID_USUARIO: 1, NOMBRE: 'Ana Torres', EMAIL: 'ana.torres@example.com', ID_OFICINA: 7 }, // Oficina San Juan
  { ID_USUARIO: 2, NOMBRE: 'Carlos Garcia', EMAIL: 'carlos.garcia@example.com', ID_OFICINA: 16 }, // Oficina Arequipa
  { ID_USUARIO: 3, NOMBRE: 'Sofia Rodriguez', EMAIL: 'sofia.r@example.com', ID_OFICINA: 13 }, // Oficina Principal
  { ID_USUARIO: 101, NOMBRE: 'Roberto Diaz (Agente)', EMAIL: 'roberto.diaz@support.com', ID_OFICINA: 13 },
  { ID_USUARIO: 102, NOMBRE: 'Laura Chen (Agente)', EMAIL: 'laura.chen@support.com', ID_OFICINA: 13 },
];

export const MOCK_AGENTES: Agente[] = [
  { ID_AGENTE: 1, ID_USUARIO: 101, ROL: 'Soporte N1', ACTIVO: 'S' },
  { ID_AGENTE: 2, ID_USUARIO: 102, ROL: 'Soporte N2', ACTIVO: 'S' },
];

export const MOCK_AREAS: AreaAtencion[] = [
  { ID_AREA: 1, NOMBRE: 'Sistemas', DESCRIPCION: 'Soporte técnico y de sistemas.' },
  { ID_AREA: 2, NOMBRE: 'Recursos Humanos', DESCRIPCION: 'Consultas sobre planillas, vacaciones, etc.' },
  { ID_AREA: 3, NOMBRE: 'Contabilidad', DESCRIPCION: 'Temas relacionados a finanzas y contabilidad.' },
];

export const MOCK_SUBCATEGORIAS: Subcategoria[] = [
  { ID_SUBCATEGORIA: 1, ID_AREA: 1, NOMBRE: 'Problema de Hardware' },
  { ID_SUBCATEGORIA: 2, ID_AREA: 1, NOMBRE: 'Problema de Software' },
  { ID_SUBCATEGORIA: 3, ID_AREA: 1, NOMBRE: 'Acceso a VPN' },
  { ID_SUBCATEGORIA: 4, ID_AREA: 2, NOMBRE: 'Consulta de Boleta de Pago' },
  { ID_SUBCATEGORIA: 5, ID_AREA: 2, NOMBRE: 'Solicitud de Vacaciones' },
  { ID_SUBCATEGORIA: 6, ID_AREA: 3, NOMBRE: 'Reporte de Gastos' },
  { ID_SUBCATEGORIA: 7, ID_AREA: 3, NOMBRE: 'Consulta de Facturación' },
];

export const MOCK_PRIORIDADES: Prioridad[] = [
  { ID_PRIORIDAD: 1, NOMBRE: 'Baja', NIVEL: 1 },
  { ID_PRIORIDAD: 2, NOMBRE: 'Media', NIVEL: 2 },
  { ID_PRIORIDAD: 3, NOMBRE: 'Alta', NIVEL: 3 },
  { ID_PRIORIDAD: 4, NOMBRE: 'Urgente', NIVEL: 4 },
];

export const MOCK_TIPOS_TICKET: TipoTicket[] = [
  { ID_TIPO_TICKET: 1, NOMBRE: 'Consulta' },
  { ID_TIPO_TICKET: 2, NOMBRE: 'Incidencia' },
  { ID_TIPO_TICKET: 3, NOMBRE: 'Requerimiento' },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    ID_TICKET: 101,
    ID_USUARIO: 1,
    ID_AREA: 1,
    ID_SUBCATEGORIA: 2,
    ID_TIPO_TICKET: 2,
    ID_PRIORIDAD: 3,
    ID_OFICINA: 7, // Oficina San Juan
    TITULO: 'Error al abrir la aplicación de contabilidad',
    DESCRIPCION: 'Desde esta mañana no puedo abrir el software ContaPRO. Muestra un error "Error de conexión a la base de datos". Ya reinicié el equipo pero el problema persiste. Es urgente para el cierre de mes.',
    ESTADO: 'Asignado',
    FECHA_CREACION: '2024-07-29T09:05:00Z',
    FECHA_ACTUALIZACION: '2024-07-29T09:05:00Z',
  },
  {
    ID_TICKET: 102,
    ID_USUARIO: 2,
    ID_AREA: 2,
    ID_SUBCATEGORIA: 4,
    ID_TIPO_TICKET: 1,
    ID_PRIORIDAD: 2,
    ID_OFICINA: 16, // Oficina Arequipa
    TITULO: 'No he recibido mi boleta de pago de este mes',
    DESCRIPCION: 'Hola, quisiera saber por qué aún no me llega mi boleta de pago correspondiente al mes de Julio. Usualmente la recibo los días 28.',
    ESTADO: 'En Progreso',
    FECHA_CREACION: '2024-07-28T15:30:00Z',
    FECHA_ACTUALIZACION: '2024-07-29T10:00:00Z',
  },
  {
    ID_TICKET: 103,
    ID_USUARIO: 3,
    ID_AREA: 1,
    ID_SUBCATEGORIA: 3,
    ID_TIPO_TICKET: 3,
    ID_PRIORIDAD: 2,
    ID_OFICINA: 13, // Oficina Principal
    TITULO: 'Solicitud de acceso a VPN para nuevo personal',
    DESCRIPCION: 'Por favor, crear un acceso a la VPN para el nuevo integrante del equipo de marketing, Juan Perez. Su correo es juan.perez@example.com. Gracias.',
    ESTADO: 'Resuelto',
    FECHA_CREACION: '2024-07-27T11:00:00Z',
    FECHA_ACTUALIZACION: '2024-07-28T16:45:00Z',
    FECHA_CIERRE: '2024-07-28T16:45:00Z',
  },
  {
    ID_TICKET: 104,
    ID_USUARIO: 1,
    ID_AREA: 3,
    ID_SUBCATEGORIA: 6,
    ID_TIPO_TICKET: 1,
    ID_PRIORIDAD: 1,
    ID_OFICINA: 7, // Oficina San Juan
    TITULO: 'Consulta sobre cómo registrar viáticos',
    DESCRIPCION: 'Buen día, tengo una duda sobre el nuevo formato para registrar viáticos de viaje. ¿Me podrían indicar dónde encuentro el manual o los pasos a seguir?',
    ESTADO: 'Cerrado',
    FECHA_CREACION: '2024-07-26T14:20:00Z',
    FECHA_ACTUALIZACION: '2024-07-27T09:10:00Z',
    FECHA_CIERRE: '2024-07-27T09:10:00Z',
  },
  {
    ID_TICKET: 105,
    ID_USUARIO: 2,
    ID_AREA: 1,
    ID_SUBCATEGORIA: 1,
    ID_TIPO_TICKET: 2,
    ID_PRIORIDAD: 3,
    ID_OFICINA: 16, // Oficina Arequipa
    TITULO: 'Mi monitor no enciende',
    DESCRIPCION: 'He intentado conectar y desconectar el cable de alimentación y el cable de video, pero la pantalla sigue en negro.',
    ESTADO: 'Nuevo',
    FECHA_CREACION: '2024-07-30T11:00:00Z',
    FECHA_ACTUALIZACION: '2024-07-30T11:00:00Z',
  },
];


export const MOCK_COMENTARIOS: Comentario[] = [
    {
        ID_COMENTARIO: 1,
        ID_TICKET: 101,
        ID_USUARIO: 101,
        MENSAJE: "Hola Ana, estamos revisando el problema de conexión con el servidor de ContaPRO. Te mantendremos informada.",
        FECHA: "2024-07-29T09:15:00Z"
    },
    {
        ID_COMENTARIO: 2,
        ID_TICKET: 101,
        ID_USUARIO: 1,
        MENSAJE: "Gracias, quedo a la espera. Es muy importante para nosotros.",
        FECHA: "2024-07-29T09:20:00Z"
    },
    {
        ID_COMENTARIO: 3,
        ID_TICKET: 102,
        ID_USUARIO: 102,
        MENSAJE: "Carlos, hemos verificado y hubo un retraso en el procesamiento. Tu boleta debería llegarte en el transcurso del día de hoy. Disculpa las molestias.",
        FECHA: "2024-07-29T10:00:00Z"
    }
];

export const MOCK_TICKET_AGENTES: TicketAgente[] = [
    { ID_TICKET: 101, ID_AGENTE: 1, ROL_EN_TICKET: 'Principal', FECHA_ASIGNACION: '2024-07-29T09:10:00Z', ACTIVO: 'S'},
    { ID_TICKET: 101, ID_AGENTE: 2, ROL_EN_TICKET: 'Colaborador', FECHA_ASIGNACION: '2024-07-29T09:10:00Z', ACTIVO: 'S'},
    { ID_TICKET: 102, ID_AGENTE: 2, ROL_EN_TICKET: 'Principal', FECHA_ASIGNACION: '2024-07-28T15:40:00Z', ACTIVO: 'S'},
    { ID_TICKET: 103, ID_AGENTE: 1, ROL_EN_TICKET: 'Principal', FECHA_ASIGNACION: '2024-07-27T11:05:00Z', ACTIVO: 'N'},
];

export const MOCK_TICKET_HISTORIAL: TicketHistorial[] = [
    { ID_HISTORIAL: 1, ID_TICKET: 102, CAMPO_CAMBIADO: 'ESTADO', VALOR_ANTERIOR: 'Asignado', VALOR_NUEVO: 'En Progreso', FECHA_CAMBIO: '2024-07-29T10:00:00Z', ID_USUARIO: 102 },
    { ID_HISTORIAL: 2, ID_TICKET: 103, CAMPO_CAMBIADO: 'ESTADO', VALOR_ANTERIOR: 'En Progreso', VALOR_NUEVO: 'Resuelto', FECHA_CAMBIO: '2024-07-28T16:45:00Z', ID_USUARIO: 101 },
    { ID_HISTORIAL: 3, ID_TICKET: 104, CAMPO_CAMBIADO: 'ESTADO', VALOR_ANTERIOR: 'Resuelto', VALOR_NUEVO: 'Cerrado', FECHA_CAMBIO: '2024-07-27T09:10:00Z', ID_USUARIO: 1 },
    { ID_HISTORIAL: 4, ID_TICKET: 101, CAMPO_CAMBIADO: 'PRIORIDAD', VALOR_ANTERIOR: 'Media', VALOR_NUEVO: 'Alta', FECHA_CAMBIO: '2024-07-29T09:05:00Z', ID_USUARIO: 1},
    { ID_HISTORIAL: 5, ID_TICKET: 101, CAMPO_CAMBIADO: 'ESTADO', VALOR_ANTERIOR: 'Nuevo', VALOR_NUEVO: 'Asignado', FECHA_CAMBIO: '2024-07-29T09:10:00Z', ID_USUARIO: 101},
];