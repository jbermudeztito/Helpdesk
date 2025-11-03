import React, { useState, useMemo } from 'react';
import type { Ticket, Comentario, TicketAgente, TicketHistorial } from '../types';
import { MOCK_USUARIOS, MOCK_AGENTES, MOCK_AREAS, MOCK_SUBCATEGORIAS, MOCK_PRIORIDADES, MOCK_TIPOS_TICKET, MOCK_OFICINAS } from '../constants';
import { ArrowLeftIcon, UserCircleIcon, PaperAirplaneIcon, UsersIcon, ClockIcon, XCircleIcon, CheckCircleIcon, ArrowUturnLeftIcon, ForwardIcon, HandRaisedIcon, BoltIcon } from './common/Icons';

interface TicketDetailViewProps {
  ticket: Ticket;
  comments: Comentario[];
  ticketAgents: TicketAgente[];
  ticketHistory: TicketHistorial[];
  userRole: 'user' | 'agent';
  onBack: () => void;
  onAddComment: (ticketId: number, newComment: Comentario) => void;
  onStatusChange: (ticketId: number, newStatus: string) => void;
  onAssignAgent: (ticketId: number, agentId: number, role: 'Principal' | 'Secundario' | 'Colaborador') => void;
  onUnassignAgent: (ticketId: number, agentId: number) => void;
}

const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  comments: allComments,
  ticketAgents,
  ticketHistory,
  userRole,
  onBack,
  onAddComment,
  onStatusChange,
  onAssignAgent,
  onUnassignAgent,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [agentToAssign, setAgentToAssign] = useState('');

  const ticketData = useMemo(() => {
    return {
      user: MOCK_USUARIOS.find(u => u.ID_USUARIO === ticket.ID_USUARIO),
      area: MOCK_AREAS.find(a => a.ID_AREA === ticket.ID_AREA),
      subcategory: MOCK_SUBCATEGORIAS.find(s => s.ID_SUBCATEGORIA === ticket.ID_SUBCATEGORIA),
      priority: MOCK_PRIORIDADES.find(p => p.ID_PRIORIDAD === ticket.ID_PRIORIDAD),
      type: MOCK_TIPOS_TICKET.find(t => t.ID_TIPO_TICKET === ticket.ID_TIPO_TICKET),
      oficina: MOCK_OFICINAS.find(o => o.ID_OFICINA === ticket.ID_OFICINA),
    };
  }, [ticket]);

  const comments = useMemo(() => {
    return allComments
        .filter(c => c.ID_TICKET === ticket.ID_TICKET)
        .sort((a, b) => new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime());
  }, [allComments, ticket.ID_TICKET]);
  
  const history = useMemo(() => ticketHistory
    .filter(h => h.ID_TICKET === ticket.ID_TICKET)
    .sort((a, b) => new Date(b.FECHA_CAMBIO).getTime() - new Date(a.FECHA_CAMBIO).getTime()), 
    [ticketHistory, ticket.ID_TICKET]);

  const assignedAgents = useMemo(() => ticketAgents
    .filter(ta => ta.ID_TICKET === ticket.ID_TICKET)
    .map(ta => {
        const agentInfo = MOCK_AGENTES.find(a => a.ID_AGENTE === ta.ID_AGENTE);
        const userInfo = MOCK_USUARIOS.find(u => u.ID_USUARIO === agentInfo?.ID_USUARIO);
        return { ...ta, ...agentInfo, ...userInfo };
    }), [ticketAgents, ticket.ID_TICKET]);
    
  const availableAgents = useMemo(() => MOCK_AGENTES.filter(agent => 
    !assignedAgents.some(assigned => assigned.ID_AGENTE === agent.ID_AGENTE)
  ).map(agent => ({...agent, ...MOCK_USUARIOS.find(u => u.ID_USUARIO === agent.ID_USUARIO)})), [assignedAgents]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const commenterId = userRole === 'user' 
        ? ticket.ID_USUARIO 
        : (MOCK_USUARIOS.find(u => u.EMAIL.includes('Roberto'))?.ID_USUARIO ?? 101);

      const comment: Comentario = {
        ID_COMENTARIO: Date.now(),
        ID_TICKET: ticket.ID_TICKET,
        ID_USUARIO: commenterId,
        MENSAJE: newComment,
        FECHA: new Date().toISOString(),
      };
      onAddComment(ticket.ID_TICKET, comment);
      setNewComment('');
    }
  };

  const handleAssign = () => {
    if (agentToAssign) {
      onAssignAgent(ticket.ID_TICKET, parseInt(agentToAssign), 'Principal');
      setAgentToAssign('');
      setIsAssigning(false);
    }
  };
    
  const getUsername = (userId: number) => MOCK_USUARIOS.find(u => u.ID_USUARIO === userId)?.NOMBRE || `Usuario #${userId}`;

  const ActionButtons = () => {
      const buttonBaseClasses = "flex items-center justify-center font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 text-white transform hover:scale-105";

      if (userRole === 'agent') {
          switch (ticket.ESTADO) {
              case 'Asignado':
                  return <button onClick={() => onStatusChange(ticket.ID_TICKET, 'En Progreso')} className={`${buttonBaseClasses} bg-green-600 hover:bg-green-700`}><CheckCircleIcon className="w-5 h-5 mr-2"/> Aceptar Ticket</button>;
              case 'En Progreso':
              case 'Reabierto':
                  return (
                      <>
                          <button onClick={() => onStatusChange(ticket.ID_TICKET, 'En Espera')} className={`${buttonBaseClasses} bg-yellow-500 hover:bg-yellow-600`}><HandRaisedIcon className="w-5 h-5 mr-2"/> Poner en Espera</button>
                          <button onClick={() => onStatusChange(ticket.ID_TICKET, 'Escalado')} className={`${buttonBaseClasses} bg-orange-500 hover:bg-orange-600`}><ForwardIcon className="w-5 h-5 mr-2"/> Escalar</button>
                          <button onClick={() => onStatusChange(ticket.ID_TICKET, 'Resuelto')} className={`${buttonBaseClasses} bg-blue-600 hover:bg-blue-700`}><CheckCircleIcon className="w-5 h-5 mr-2"/> Marcar como Resuelto</button>
                      </>
                  );
               case 'Escalado':
                   return <button onClick={() => onStatusChange(ticket.ID_TICKET, 'En Progreso')} className={`${buttonBaseClasses} bg-green-600 hover:bg-green-700`}><CheckCircleIcon className="w-5 h-5 mr-2"/> Reanudar Trabajo</button>;
              default:
                  return null;
          }
      } else { // User role
          switch (ticket.ESTADO) {
              case 'Resuelto':
                  return (
                      <>
                          <button onClick={() => onStatusChange(ticket.ID_TICKET, 'Cerrado')} className={`${buttonBaseClasses} bg-green-600 hover:bg-green-700`}><CheckCircleIcon className="w-5 h-5 mr-2"/> Confirmar Solución</button>
                          <button onClick={() => onStatusChange(ticket.ID_TICKET, 'Reabierto')} className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}><ArrowUturnLeftIcon className="w-5 h-5 mr-2"/> El problema persiste</button>
                      </>
                  );
              case 'Cerrado':
                  return <button onClick={() => onStatusChange(ticket.ID_TICKET, 'Reabierto')} className={`${buttonBaseClasses} bg-red-600 hover:bg-red-700`}><ArrowUturnLeftIcon className="w-5 h-5 mr-2"/> Reabrir Ticket</button>;
              default:
                  return null;
          }
      }
  };

  return (
    <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeftIcon className="w-5 h-5"/>
            Volver
        </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Ticket #{ticket.ID_TICKET}</span>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mt-1">{ticket.TITULO}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ticket.DESCRIPCION}</p>
            </div>
            
             {/* Action Panel */}
            <div className="bg-blue-50 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                    <BoltIcon className="w-6 h-6 text-blue-500"/>
                    Acciones Disponibles
                </h2>
                <div className="flex flex-wrap gap-3">
                    {ActionButtons()}
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4">Conversación</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                    {comments.map((comment) => {
                        const commenter = MOCK_USUARIOS.find(u => u.ID_USUARIO === comment.ID_USUARIO);
                        const isAgent = MOCK_AGENTES.some(a => a.ID_USUARIO === comment.ID_USUARIO);
                        return (
                            <div key={comment.ID_COMENTARIO} className={`flex gap-3 ${isAgent ? 'justify-end' : ''}`}>
                                {!isAgent && <UserCircleIcon className="w-10 h-10 text-gray-400 flex-shrink-0" />}
                                <div className={`max-w-xl p-3 rounded-lg ${isAgent ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                    <p className="font-semibold text-sm">{commenter?.NOMBRE}</p>
                                    <p className="text-sm">{comment.MENSAJE}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">{new Date(comment.FECHA).toLocaleString()}</p>
                                </div>
                                {isAgent && <UserCircleIcon className="w-10 h-10 text-blue-500 flex-shrink-0" />}
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={handleCommentSubmit} className="mt-6 flex gap-2">
                    <input 
                        type="text" 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg" disabled={!newComment.trim()}>
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    </button>
                </form>
            </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Detalles del Ticket</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Estado:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticket.ESTADO}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Prioridad:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticketData.priority?.NOMBRE}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Solicitante:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticketData.user?.NOMBRE}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Oficina:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticketData.oficina?.NOMBRE}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Área:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticketData.area?.NOMBRE}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Subcategoría:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{ticketData.subcategory?.NOMBRE}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Fecha Creación:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(ticket.FECHA_CREACION).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Última Actualización:</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{new Date(ticket.FECHA_ACTUALIZACION).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Agent Assignment */}
            {userRole === 'agent' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4 flex items-center gap-2">
                        <UsersIcon className="w-6 h-6"/> Agentes Asignados
                    </h3>
                    <ul className="space-y-2 mb-4">
                        {assignedAgents.length > 0 ? assignedAgents.map(agent => (
                            <li key={agent.ID_AGENTE} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-semibold">{agent.NOMBRE}</p>
                                    <p className="text-xs text-gray-500">{agent.ROL_EN_TICKET}</p>
                                </div>
                                <button onClick={() => onUnassignAgent(ticket.ID_TICKET, agent.ID_AGENTE)} className="text-red-500 hover:text-red-700">
                                    <XCircleIcon className="w-5 h-5"/>
                                </button>
                            </li>
                        )) : <p className="text-sm text-gray-500">No hay agentes asignados.</p>}
                    </ul>
                    
                    {isAssigning ? (
                        <div className="flex gap-2">
                            <select value={agentToAssign} onChange={e => setAgentToAssign(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm">
                                <option value="">Seleccionar agente</option>
                                {availableAgents.map(agent => (
                                    <option key={agent.ID_AGENTE} value={agent.ID_AGENTE}>{agent.NOMBRE}</option>
                                ))}
                            </select>
                            <button onClick={handleAssign} className="bg-green-600 text-white px-3 rounded-md">Asignar</button>
                            <button onClick={() => setIsAssigning(false)} className="bg-gray-300 px-3 rounded-md">X</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAssigning(true)} disabled={availableAgents.length === 0} className="w-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            Asignar Agente
                        </button>
                    )}
                </div>
            )}

            {/* History Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ClockIcon className="w-6 h-6"/> Historial del Ticket</h2>
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-4">
                    {history.map(h => (
                        <li key={h.ID_HISTORIAL} className="text-sm border-l-2 pl-3 border-gray-200 dark:border-gray-600">
                            <p>
                                <strong>{h.CAMPO_CAMBIADO}:</strong> de "{h.VALOR_ANTERIOR}" a "{h.VALOR_NUEVO}"
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Por {getUsername(h.ID_USUARIO)} - {new Date(h.FECHA_CAMBIO).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailView;