import React, { useState, useMemo } from 'react';
import type { Ticket, TicketAgente } from '../types';
import { 
    HelpdeskIcon, 
    UserIcon, 
    UserPlusIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    StarIcon,
    SearchIcon
} from './common/Icons';
import { MOCK_USUARIOS, MOCK_AREAS, MOCK_PRIORIDADES } from '../constants';

interface AgentDashboardProps {
  onTicketSelect: (id: number) => void;
  tickets: Ticket[];
  ticketAgentAssignments: TicketAgente[];
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; unit?: string; }> = ({ icon, title, value, unit }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-gray-700 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                    {unit && <span className="text-base font-medium ml-1">{unit}</span>}
                </p>
            </div>
        </div>
    );
};

const TicketStatusBadge: React.FC<{ status: Ticket['ESTADO'] }> = ({ status }) => {
    const statusClasses = {
        'Nuevo': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'Asignado': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'En Progreso': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'En Espera': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        'Resuelto': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'Cerrado': 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        'Escalado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        'Reabierto': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const AgentDashboard: React.FC<AgentDashboardProps> = ({ onTicketSelect, tickets, ticketAgentAssignments }) => {
  const [activeTab, setActiveTab] = useState('mis-asignados');
  const [searchTerm, setSearchTerm] = useState('');

  // Mocked current agent ID
  const currentAgentId = 1; 

  const stats = useMemo(() => {
    const openTickets = tickets.filter(t => t.ESTADO !== 'Cerrado' && t.ESTADO !== 'Resuelto');
    const myTicketAssignments = ticketAgentAssignments.filter(ta => ta.ID_AGENTE === currentAgentId && ta.ACTIVO === 'S');
    const myTicketIds = myTicketAssignments.map(ta => ta.ID_TICKET);
    const myOpenTickets = openTickets.filter(t => myTicketIds.includes(t.ID_TICKET));
    const newUnassignedTickets = tickets.filter(t => t.ESTADO === 'Nuevo');

    return {
      totalOpen: openTickets.length,
      myTickets: myOpenTickets.length,
      newUnassigned: newUnassignedTickets.length,
      resolvedToday: 0, // Mocked
      avgResponseTime: "9.3", // Mocked
      satisfaction: 95, // Mocked
    };
  }, [tickets, ticketAgentAssignments]);

  const displayedTickets = useMemo(() => {
      let filteredTickets: Ticket[] = [];
      if (activeTab === 'mis-asignados') {
          const myAssignedIds = ticketAgentAssignments
              .filter(ta => ta.ID_AGENTE === currentAgentId && ta.ACTIVO === 'S')
              .map(ta => ta.ID_TICKET);
          filteredTickets = tickets.filter(t => myAssignedIds.includes(t.ID_TICKET));
      } else { // 'nuevos-sin-asignar'
          filteredTickets = tickets.filter(t => t.ESTADO === 'Nuevo');
      }

      if (searchTerm) {
          const lowercasedTerm = searchTerm.toLowerCase();
          return filteredTickets.filter(ticket =>
              ticket.TITULO.toLowerCase().includes(lowercasedTerm) ||
              ticket.ID_TICKET.toString().includes(lowercasedTerm)
          );
      }
      return filteredTickets;
  }, [tickets, ticketAgentAssignments, activeTab, searchTerm]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Panel de Agente
      </h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={<HelpdeskIcon className="w-6 h-6 text-blue-600" />} title="Total Abiertos" value={stats.totalOpen} />
        <StatCard icon={<UserIcon className="w-6 h-6 text-blue-600" />} title="Mis Tickets" value={stats.myTickets} />
        <StatCard icon={<UserPlusIcon className="w-6 h-6 text-blue-600" />} title="Nuevos sin Asignar" value={stats.newUnassigned} />
        <StatCard icon={<CheckCircleIcon className="w-6 h-6 text-blue-600" />} title="Resueltos Hoy" value={stats.resolvedToday} />
        <StatCard icon={<ClockIcon className="w-6 h-6 text-blue-600" />} title="Tiempo Prom. Respuesta" value={stats.avgResponseTime} unit="hrs" />
        <StatCard icon={<StarIcon className="w-6 h-6 text-blue-600" />} title="Satisfacción" value={stats.satisfaction} unit="%" />
      </div>

      {/* Tickets List */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button onClick={() => setActiveTab('mis-asignados')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'mis-asignados' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                        Mis Tickets Asignados ({stats.myTickets})
                    </button>
                    <button onClick={() => setActiveTab('nuevos-sin-asignar')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'nuevos-sin-asignar' ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}>
                        Nuevos sin Asignar ({stats.newUnassigned})
                    </button>
                </div>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar tickets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Título</th>
                        <th scope="col" className="px-6 py-3">Estado</th>
                        <th scope="col" className="px-6 py-3">Prioridad</th>
                        <th scope="col" className="px-6 py-3 hidden md:table-cell">Área</th>
                        <th scope="col" className="px-6 py-3 hidden lg:table-cell">Solicitante</th>
                        <th scope="col" className="px-6 py-3 hidden lg:table-cell">Fecha Creación</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedTickets.length > 0 ? displayedTickets.map(ticket => {
                        const user = MOCK_USUARIOS.find(u => u.ID_USUARIO === ticket.ID_USUARIO);
                        const area = MOCK_AREAS.find(a => a.ID_AREA === ticket.ID_AREA);
                        const priority = MOCK_PRIORIDADES.find(p => p.ID_PRIORIDAD === ticket.ID_PRIORIDAD);
                        return (
                            <tr key={ticket.ID_TICKET} onClick={() => onTicketSelect(ticket.ID_TICKET)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{ticket.ID_TICKET}</td>
                                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{ticket.TITULO}</td>
                                <td className="px-6 py-4"><TicketStatusBadge status={ticket.ESTADO} /></td>
                                <td className="px-6 py-4 text-red-600 font-semibold">{priority?.NOMBRE || 'N/A'}</td>
                                <td className="px-6 py-4 hidden md:table-cell">{area?.NOMBRE || 'N/A'}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{user?.NOMBRE || 'N/A'}</td>
                                <td className="px-6 py-4 hidden lg:table-cell">{new Date(ticket.FECHA_CREACION).toLocaleString()}</td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500">
                                No se encontraron tickets.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;