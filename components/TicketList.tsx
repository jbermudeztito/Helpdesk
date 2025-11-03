import React, { useState, useMemo } from 'react';
import type { Ticket } from '../types';
import { SearchIcon, ArrowLeftIcon } from './common/Icons';
import { MOCK_USUARIOS, MOCK_AREAS, MOCK_PRIORIDADES, MOCK_OFICINAS } from '../constants';

interface TicketListProps {
  tickets: Ticket[];
  onTicketSelect: (id: number) => void;
  onBack: () => void;
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

const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketSelect, onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    type SortKey = 'FECHA_ACTUALIZACION' | 'ID_PRIORIDAD' | 'FECHA_CREACION';
    const [sortKey, setSortKey] = useState<SortKey>('FECHA_CREACION');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredAndSortedTickets = useMemo(() => {
        let filtered = tickets;

        if (statusFilter !== 'all') {
            filtered = filtered.filter(ticket => ticket.ESTADO === statusFilter);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(ticket =>
                ticket.TITULO.toLowerCase().includes(lowercasedTerm) ||
                ticket.ID_TICKET.toString().includes(lowercasedTerm)
            );
        }

        return [...filtered].sort((a, b) => {
            if (sortKey === 'ID_PRIORIDAD') {
                const comparison = b.ID_PRIORIDAD - a.ID_PRIORIDAD; // Higher priority first
                return sortOrder === 'asc' ? -comparison : comparison;
            }
            const dateA = new Date(a[sortKey]).getTime();
            const dateB = new Date(b[sortKey]).getTime();
            return sortOrder === 'asc' ? dateA - dateB : dateB - a;
        });

    }, [tickets, searchTerm, statusFilter, sortKey, sortOrder]);

    const handleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };
    
    const getSortIndicator = (key: SortKey) => {
        if (sortKey !== key) return null;
        return sortOrder === 'desc' ? '▼' : '▲';
    };


  return (
    <div>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeftIcon className="w-5 h-5"/>
            Volver al Portal
        </button>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Buscar por título o ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                        >
                            <option value="all">Todos los Estados</option>
                            {['Nuevo', 'Asignado', 'En Progreso', 'En Espera', 'Resuelto', 'Cerrado', 'Escalado', 'Reabierto'].map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
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
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Área</th>
                            <th scope="col" className="px-6 py-3 hidden lg:table-cell">Solicitante</th>
                            <th scope="col" className="px-6 py-3 hidden md:table-cell">Oficina</th>
                            <th scope="col" className="px-6 py-3 cursor-pointer hidden lg:table-cell" onClick={() => handleSort('FECHA_CREACION')}>
                                Fecha de Creación {getSortIndicator('FECHA_CREACION')}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('FECHA_ACTUALIZACION')}>
                                Última Actualización {getSortIndicator('FECHA_ACTUALIZACION')}
                            </th>
                            <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('ID_PRIORIDAD')}>
                                Prioridad {getSortIndicator('ID_PRIORIDAD')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedTickets.length > 0 ? filteredAndSortedTickets.map(ticket => {
                            const user = MOCK_USUARIOS.find(u => u.ID_USUARIO === ticket.ID_USUARIO);
                            const area = MOCK_AREAS.find(a => a.ID_AREA === ticket.ID_AREA);
                            const priority = MOCK_PRIORIDADES.find(p => p.ID_PRIORIDAD === ticket.ID_PRIORIDAD);
                            const oficina = MOCK_OFICINAS.find(o => o.ID_OFICINA === ticket.ID_OFICINA);
                            return (
                                <tr key={ticket.ID_TICKET} onClick={() => onTicketSelect(ticket.ID_TICKET)} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">#{ticket.ID_TICKET}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{ticket.TITULO}</td>
                                    <td className="px-6 py-4"><TicketStatusBadge status={ticket.ESTADO} /></td>
                                    <td className="px-6 py-4 hidden md:table-cell">{area?.NOMBRE || 'N/A'}</td>
                                    <td className="px-6 py-4 hidden lg:table-cell">{user?.NOMBRE || 'N/A'}</td>
                                    <td className="px-6 py-4 hidden md:table-cell">{oficina?.NOMBRE || 'N/A'}</td>
                                    <td className="px-6 py-4 hidden lg:table-cell">{new Date(ticket.FECHA_CREACION).toLocaleString()}</td>
                                    <td className="px-6 py-4">{new Date(ticket.FECHA_ACTUALIZACION).toLocaleString()}</td>
                                    <td className="px-6 py-4">{priority?.NOMBRE || 'N/A'}</td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-500">
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

export default TicketList;