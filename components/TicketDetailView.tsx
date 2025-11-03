import React, { useState, useRef, useMemo } from 'react';
import type { Ticket, TicketAgente, TicketHistorial, Comentario } from '../types';
import { MOCK_USUARIOS, MOCK_AREAS, MOCK_SUBCATEGORIAS, MOCK_PRIORIDADES, MOCK_TIPOS_TICKET, MOCK_OFICINAS, MOCK_COMENTARIOS, MOCK_AGENTES } from '../constants';
import { ArrowLeftIcon, PaperAirplaneIcon, XCircleIcon, UserPlusIcon, BoltIcon, CheckCircleIcon, UserCircleIcon, ClockIcon, UsersIcon } from './common/Icons';

interface TicketDetailViewProps {
  ticketId: number;
  onBack: () => void;
  userRole: 'user' | 'agent';
  tickets: Ticket[];
  ticketAgentAssignments: TicketAgente[];
  ticketHistory: TicketHistorial[];
  onAssignAgent: (ticketId: number, agentId: number) => void;
}

const DetailCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode, className?: string }> = ({ title, icon, children, className }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);


const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticketId, onBack, userRole, tickets, ticketAgentAssignments, ticketHistory, onAssignAgent }) => {
  // Assume current agent is the first one for simplicity
  const currentAgentId = 1; 
  
  const ticket = tickets.find(t => t.ID_TICKET === ticketId);

  const [ticketComments, setTicketComments] = useState<Comentario[]>(MOCK_COMENTARIOS.filter(c => c.ID_TICKET === ticketId).sort((a,b) => new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime()));
  const [newComment, setNewComment] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  
  const assignedAgentsInfo = useMemo(() => ticketAgentAssignments
    .filter(ta => ta.ID_TICKET === ticketId && ta.ACTIVO === 'S')
    .map(ta => {
        const agentInfo = MOCK_AGENTES.find(a => a.ID_AGENTE === ta.ID_AGENTE);
        const userInfo = agentInfo ? MOCK_USUARIOS.find(u => u.ID_USUARIO === agentInfo.ID_USUARIO) : null;
        return {
            ...ta,
            agent: agentInfo,
            user: userInfo
        }
    }), [ticketAgentAssignments, ticketId]);

  const isCurrentAgentAssigned = useMemo(() => 
    assignedAgentsInfo.some(a => a.ID_AGENTE === currentAgentId), 
  [assignedAgentsInfo, currentAgentId]);


  if (!ticket) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeftIcon className="w-5 h-5"/>
            Volver
        </button>
        <p>Ticket no encontrado.</p>
      </div>
    );
  }
  
  const handleAssign = () => {
    if (selectedAgentId && ticket) {
        onAssignAgent(ticket.ID_TICKET, parseInt(selectedAgentId));
        setSelectedAgentId('');
        setIsAssigning(false);
    }
  };
  
  const handleSelfAssign = () => {
    if (ticket && !isCurrentAgentAssigned) {
      onAssignAgent(ticket.ID_TICKET, currentAgentId);
    }
  };

  const handleAddComment = () => {
      if (newComment.trim() === '') return;
      const currentUser = MOCK_USUARIOS.find(u => u.ID_USUARIO === (userRole === 'agent' ? 101 : 1));
      if (!currentUser) return;

      const newCommentObject: Comentario = {
          ID_COMENTARIO: Date.now(),
          ID_TICKET: ticketId,
          ID_USUARIO: currentUser.ID_USUARIO,
          MENSAJE: newComment,
          FECHA: new Date().toISOString()
      };
      setTicketComments([...ticketComments, newCommentObject]);
      setNewComment('');
  };

  const user = MOCK_USUARIOS.find(u => u.ID_USUARIO === ticket.ID_USUARIO);
  const area = MOCK_AREAS.find(a => a.ID_AREA === ticket.ID_AREA);
  const subcategory = MOCK_SUBCATEGORIAS.find(s => s.ID_SUBCATEGORIA === ticket.ID_SUBCATEGORIA);
  const priority = MOCK_PRIORIDADES.find(p => p.ID_PRIORIDAD === ticket.ID_PRIORIDAD);
  const office = MOCK_OFICINAS.find(o => o.ID_OFICINA === ticket.ID_OFICINA);
  const history = ticketHistory.filter(h => h.ID_TICKET === ticketId).sort((a,b) => new Date(b.FECHA_CAMBIO).getTime() - new Date(a.FECHA_CAMBIO).getTime());
  
  const availableAgentsToAssign = MOCK_AGENTES.filter(agent => !assignedAgentsInfo.some(a => a.ID_AGENTE === agent.ID_AGENTE));

  return (
    <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6">
            <ArrowLeftIcon className="w-5 h-5"/>
            Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Ticket #{ticket.ID_TICKET}</p>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{ticket.TITULO}</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-4 whitespace-pre-wrap">{ticket.DESCRIPCION}</p>
                </div>

                {userRole === 'agent' && (
                    <DetailCard title="Acciones Disponibles" icon={<BoltIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"/>}>
                         <button 
                            onClick={handleSelfAssign}
                            disabled={isCurrentAgentAssigned}
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 disabled:bg-green-400 disabled:cursor-not-allowed">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            {isCurrentAgentAssigned ? 'Ya eres parte de este ticket' : 'Aceptar Ticket'}
                        </button>
                    </DetailCard>
                )}

                <DetailCard title="Conversación" icon={null}>
                    <div className="space-y-6">
                        {ticketComments.map(comment => {
                            const commentUser = MOCK_USUARIOS.find(u => u.ID_USUARIO === comment.ID_USUARIO);
                            const isAgent = MOCK_AGENTES.some(a => a.ID_USUARIO === comment.ID_USUARIO);
                            return (
                                <div key={comment.ID_COMENTARIO} className={`flex items-start gap-3 ${isAgent ? 'justify-end' : 'justify-start'}`}>
                                    {!isAgent && <UserCircleIcon className="w-10 h-10 text-gray-400" />}
                                    <div className={`w-full max-w-lg p-4 rounded-lg ${isAgent ? 'bg-blue-100 dark:bg-blue-900/50 text-right' : 'bg-gray-100 dark:bg-gray-700/50'}`}>
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{commentUser?.NOMBRE || 'Usuario desconocido'} {isAgent && '(Agente)'}</p>
                                        <p className="text-gray-700 dark:text-gray-300 my-2">{comment.MENSAJE}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(comment.FECHA).toLocaleString()}</p>
                                    </div>
                                    {isAgent && <UserCircleIcon className="w-10 h-10 text-blue-400" />}
                                </div>
                            );
                        })}
                        {ticketComments.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hay comentarios aún.</p>}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={1}
                                placeholder="Escribe un comentario..."
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                aria-label="Nuevo comentario"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-md transition-all duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
                                aria-label="Enviar Comentario"
                            >
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </DetailCard>
            </div>

            {/* Columna Derecha */}
            <div className="lg:col-span-1 space-y-8">
                <DetailCard title="Detalles del Ticket" icon={null}>
                    <dl className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                        <dt className="text-gray-500 dark:text-gray-400">Estado:</dt>
                        <dd className="text-gray-900 dark:text-gray-100 font-medium">{ticket.ESTADO}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Prioridad:</dt>
                        <dd className="text-gray-900 dark:text-gray-100 font-medium">{priority?.NOMBRE || 'N/A'}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Solicitante:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{user?.NOMBRE || 'N/A'}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Oficina:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{office?.NOMBRE || 'N/A'}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Área:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{area?.NOMBRE || 'N/A'}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Subcategoría:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{subcategory?.NOMBRE || 'N/A'}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Fecha Creación:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{new Date(ticket.FECHA_CREACION).toLocaleString()}</dd>
                        <dt className="text-gray-500 dark:text-gray-400">Última Actualización:</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{new Date(ticket.FECHA_ACTUALIZACION).toLocaleString()}</dd>
                    </dl>
                </DetailCard>

                <DetailCard title="Agentes Asignados" icon={<UsersIcon className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-300"/>}>
                    <ul className="space-y-3 text-sm">
                        {assignedAgentsInfo.map(a => (
                            <li key={a.ID_AGENTE} className="flex justify-between items-center text-gray-900 dark:text-gray-100">
                                <div>
                                    <span className="font-medium">{a.user?.NOMBRE}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">({a.ROL_EN_TICKET})</span>
                                </div>
                                 <button className="text-red-400 hover:text-red-600">
                                     <XCircleIcon className="w-5 h-5" />
                                 </button>
                            </li>
                        ))}
                        {assignedAgentsInfo.length === 0 && <li className="text-gray-500 dark:text-gray-400">No asignado</li>}
                    </ul>
                    {userRole === 'agent' && ticket.ESTADO !== 'Cerrado' && ticket.ESTADO !== 'Resuelto' && (
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {isAssigning ? (
                                <div className="flex gap-2">
                                    <select
                                        value={selectedAgentId}
                                        onChange={(e) => setSelectedAgentId(e.target.value)}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm"
                                        aria-label="Seleccionar agente"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {availableAgentsToAssign.map(agent => {
                                            const agentUser = MOCK_USUARIOS.find(u => u.ID_USUARIO === agent.ID_USUARIO);
                                            return <option key={agent.ID_AGENTE} value={agent.ID_AGENTE}>{agentUser?.NOMBRE}</option>
                                        })}
                                    </select>
                                    <button onClick={handleAssign} disabled={!selectedAgentId} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors disabled:bg-blue-300">Asignar</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsAssigning(true)} className="w-full text-center bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-blue-800 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                                    Asignar Agente
                                </button>
                            )}
                        </div>
                    )}
                </DetailCard>

                <DetailCard title="Historial del Ticket" icon={<ClockIcon className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-300"/>}>
                    <ul className="space-y-4">
                        {history.map(h => {
                            const changeUser = MOCK_USUARIOS.find(u => u.ID_USUARIO === h.ID_USUARIO);
                            return (
                                <li key={h.ID_HISTORIAL} className="text-xs text-gray-600 dark:text-gray-400 border-l-2 pl-3 border-gray-200 dark:border-gray-600">
                                    <p><span className="font-semibold text-gray-700 dark:text-gray-300">{h.CAMPO_CAMBIADO}:</span> de "{h.VALOR_ANTERIOR}" a "{h.VALOR_NUEVO}"</p>
                                    <p className="text-gray-500">Por {changeUser?.NOMBRE} - {new Date(h.FECHA_CAMBIO).toLocaleString()}</p>
                                </li>
                            )
                        })}
                        {history.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No hay historial de cambios.</p>}
                    </ul>
                </DetailCard>
            </div>
        </div>
    </div>
  );
};

export default TicketDetailView;