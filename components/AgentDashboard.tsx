import React, { useMemo, useState } from 'react';
import type { Ticket, TicketAgente, Comentario, Prioridad } from '../types';
import { MOCK_USUARIOS, MOCK_AGENTES, MOCK_AREAS, MOCK_PRIORIDADES } from '../constants';
// FIX: Added UserIcon to the import list.
import { SearchIcon, UserPlusIcon, TicketIcon, ClockIcon, StarIcon, CheckBadgeIcon, UserIcon } from './common/Icons';

interface AgentDashboardProps {
    tickets: Ticket[];
    ticketAgents: TicketAgente[];
    comments: Comentario[];
    onTicketSelect: (id: number) => void;
    onAssignAgent: (ticketId: number, agentId: number, role: 'Principal' | 'Secundario' | 'Colaborador') => void;
}

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

const PriorityBadge: React.FC<{ priority: Prioridad['NOMBRE'] }> = ({ priority }) => {
    const priorityClasses = {
        'Baja': 'text-gray-500',
        'Media': 'text-yellow-500',
        'Alta': 'text-orange-500',
        'Urgente': 'text-red-500 font-bold',
    };
    return (
        <span className={`font-semibold ${priorityClasses[priority]}`}>
            {priority}
        </span>
    );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        </div>
    </div>
);

const AgentDashboard: React.FC<AgentDashboardProps> = ({ tickets, ticketAgents, comments, onTicketSelect, onAssignAgent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'my-tickets' | 'unassigned'>('my-tickets');
    
    // Mocking current agent as Roberto Diaz (Agent ID 1)
    const currentAgent = MOCK_AGENTES.find(a => a.ID_AGENTE === 1);
    const currentAgentId = currentAgent?.ID_AGENTE ?? 1;

    const { myTickets, unassignedTickets, stats } = useMemo(() => {
        const myTicketIds = new Set(
            ticketAgents
                .filter(ta => ta.ID_AGENTE === currentAgentId)
                .map(ta => ta.ID_TICKET)
        );

        const allAssignedTicketIds = new Set(ticketAgents.map(ta => ta.ID_TICKET));

        const myFilteredTickets = tickets.filter(t => myTicketIds.has(t.ID_TICKET) && t.ESTADO !== 'Cerrado' && t.ESTADO !== 'Resuelto');
        const unassignedFilteredTickets = tickets.filter(t => !allAssignedTicketIds.has(t.ID_TICKET) && (t.ESTADO === 'Nuevo' || t.ESTADO === 'Reabierto'));
        
        // --- Calculate Stats ---
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const resolvedTodayCount = tickets.filter(t => 
            (t.ESTADO === 'Resuelto' || t.ESTADO === 'Cerrado') &&
            t.FECHA_CIERRE &&
            new Date(t.FECHA_CIERRE) >= today
        ).length;

        const agentUserIds = new Set(MOCK_AGENTES.map(a => a.ID_USUARIO));
        const responseTimes: number[] = [];
        tickets.forEach(ticket => {
            const firstAgentComment = comments
                .filter(c => c.ID_TICKET === ticket.ID_TICKET && agentUserIds.has(c.ID_USUARIO))
                .sort((a, b) => new Date(a.FECHA).getTime() - new Date(b.FECHA).getTime())[0];
            
            if (firstAgentComment) {
                const creationTime = new Date(ticket.FECHA_CREACION).getTime();
                const responseTime = new Date(firstAgentComment.FECHA).getTime();
                responseTimes.push(responseTime - creationTime);
            }
        });
        
        let avgResponseTime = 'N/A';
        if (responseTimes.length > 0) {
            const avgMs = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
            const avgMinutes = Math.round(avgMs / 60000);
            if (avgMinutes < 60) {
                avgResponseTime = `${avgMinutes} min`;
            } else {
                avgResponseTime = `${(avgMinutes / 60).toFixed(1)} hrs`;
            }
        }

        const openTicketsCount = tickets.filter(t => t.ESTADO !== 'Cerrado' && t.ESTADO !== 'Resuelto').length;


        const calculatedStats = {
            resolvedToday: resolvedTodayCount,
            avgResponseTime,
            satisfactionRate: '95%', // Mocked
            openTickets: openTicketsCount,
            myTicketsCount: myFilteredTickets.length,
            unassignedCount: unassignedFilteredTickets.length,
        };

        return { myTickets: myFilteredTickets, unassignedTickets: unassignedFilteredTickets, stats: calculatedStats };
    }, [tickets, ticketAgents, comments, currentAgentId]);

    const filteredTickets = useMemo(() => {
        const source = activeTab === 'my-tickets' ? myTickets : unassignedTickets;
        if (!searchTerm) return source;
        const lowercasedTerm = searchTerm.toLowerCase();
        return source.filter(ticket =>
            ticket.TITULO.toLowerCase().includes(lowercasedTerm) ||
            ticket.ID_TICKET.toString().includes(lowercasedTerm)
        );
    }, [activeTab, myTickets, unassignedTickets, searchTerm]);

    const handleAssignToMe = (ticketId: number) => {
        onAssignAgent(ticketId, currentAgentId, 'Principal');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Panel de Agente</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <StatCard title="Total Abiertos" value={stats.openTickets} icon={<TicketIcon className="h-6 w-6 text-blue-600"/>} />
                    <StatCard title="Mis Tickets" value={stats.myTicketsCount} icon={<UserIcon className="h-6 w-6 text-blue-600"/>} />
                    <StatCard title="Nuevos sin Asignar" value={stats.unassignedCount} icon={<UserPlusIcon className="h-6 w-6 text-blue-600"/>} />
                    <StatCard title="Resueltos Hoy" value={stats.resolvedToday} icon={<CheckBadgeIcon className="h-6 w-6 text-blue-600"/>} />
                    <StatCard title="Tiempo Prom. Respuesta" value={stats.avgResponseTime} icon={<ClockIcon className="h-6 w-6 text-blue-600"/>} />
                    <StatCard title="Satisfacción" value={stats.satisfactionRate} icon={<StarIcon className="h-6 w-6 text-blue-600"/>} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                         <div className="border-b border-gray-200 dark:border-gray-700 w-full md:w-auto">
                            <nav className="flex space-x-4 -mb-px" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('my-tickets')}
                                    className={`font-medium py-3 px-1 border-b-2 ${
                                        activeTab === 'my-tickets'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                    }`}
                                >
                                    Mis Tickets Asignados ({myTickets.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('unassigned')}
                                    className={`font-medium py-3 px-1 border-b-2 ${
                                        activeTab === 'unassigned'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                    }`}
                                >
                                    Nuevos sin Asignar ({unassignedTickets.length})
                                </button>
                            </nav>
                        </div>
                        <div className="relative flex-grow w-full md:w-auto md:max-w-xs">
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
                                {activeTab === 'unassigned' && <th scope="col" className="px-6 py-3"><span className="sr-only">Acciones</span></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTickets.length > 0 ? filteredTickets.map(ticket => {
                                const user = MOCK_USUARIOS.find(u => u.ID_USUARIO === ticket.ID_USUARIO);
                                const area = MOCK_AREAS.find(a => a.ID_AREA === ticket.ID_AREA);
                                const priority = MOCK_PRIORIDADES.find(p => p.ID_PRIORIDAD === ticket.ID_PRIORIDAD);
                                return (
                                    <tr key={ticket.ID_TICKET} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 font-medium text-gray-900 dark:text-white cursor-pointer">#{ticket.ID_TICKET}</td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100 cursor-pointer">{ticket.TITULO}</td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 cursor-pointer"><TicketStatusBadge status={ticket.ESTADO} /></td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 cursor-pointer"><PriorityBadge priority={priority?.NOMBRE || 'Baja'} /></td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 hidden md:table-cell cursor-pointer">{area?.NOMBRE || 'N/A'}</td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 hidden lg:table-cell cursor-pointer">{user?.NOMBRE || 'N/A'}</td>
                                        <td onClick={() => onTicketSelect(ticket.ID_TICKET)} className="px-6 py-4 hidden lg:table-cell cursor-pointer">{new Date(ticket.FECHA_CREACION).toLocaleString()}</td>
                                        {activeTab === 'unassigned' && (
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleAssignToMe(ticket.ID_TICKET)} className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                                    <UserPlusIcon className="h-4 w-4 mr-1"/>
                                                    Asignarme
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                )}) : (
                                <tr>
                                    <td colSpan={activeTab === 'unassigned' ? 8 : 7} className="text-center py-8 text-gray-500">
                                        No hay tickets en esta vista.
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