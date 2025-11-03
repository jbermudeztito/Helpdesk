import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import TicketList from './components/TicketList';
import CreateTicketForm from './components/CreateTicketForm';
import TicketDetailView from './components/TicketDetailView';
import AgentDashboard from './components/AgentDashboard';
import UserDashboard from './components/UserDashboard';
import type { Ticket, Comentario, TicketAgente, TicketHistorial } from './types';
import { MOCK_TICKETS, MOCK_COMENTARIOS, MOCK_TICKET_AGENTES, MOCK_TICKET_HISTORIAL, MOCK_AGENTES, MOCK_USUARIOS } from './constants';

type View = 'list' | 'create' | 'detail' | 'agent-dashboard' | 'user-dashboard';
type UserRole = 'user' | 'agent';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user-dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [comments, setComments] = useState<Comentario[]>(MOCK_COMENTARIOS);
  const [ticketAgents, setTicketAgents] = useState<TicketAgente[]>(MOCK_TICKET_AGENTES);
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [ticketHistory, setTicketHistory] = useState<TicketHistorial[]>(MOCK_TICKET_HISTORIAL);
  const [preselectedAreaId, setPreselectedAreaId] = useState<number | null>(null);

  const handleCreateTicketClick = useCallback(() => {
    setView('user-dashboard');
    setSelectedTicketId(null);
    setPreselectedAreaId(null);
  }, []);

  const handleAreaSelectForCreation = useCallback((areaId: number) => {
    setPreselectedAreaId(areaId);
    setView('create');
  }, []);
  
  const handleViewMyTickets = useCallback(() => {
      setView('list');
  }, []);

  const handleTicketSelect = useCallback((id: number) => {
    setSelectedTicketId(id);
    setView('detail');
  }, []);

  const handleBackToList = useCallback(() => {
    setPreselectedAreaId(null);
    if (userRole === 'agent') {
      setView('agent-dashboard');
    } else {
      setView('user-dashboard');
    }
    setSelectedTicketId(null);
  }, [userRole]);
  
  const addHistoryEntry = useCallback((ticketId: number, campo: string, valorAnterior: string, valorNuevo: string, usuarioId: number) => {
    const newHistoryEntry: TicketHistorial = {
      ID_HISTORIAL: Date.now(),
      ID_TICKET: ticketId,
      CAMPO_CAMBIADO: campo,
      VALOR_ANTERIOR: valorAnterior,
      VALOR_NUEVO: valorNuevo,
      FECHA_CAMBIO: new Date().toISOString(),
      ID_USUARIO: usuarioId,
    };
    setTicketHistory(prev => [newHistoryEntry, ...prev]);
  }, []);

  const updateTicketStatus = useCallback((ticketId: number, newStatus: string) => {
    const ticketToUpdate = tickets.find(t => t.ID_TICKET === ticketId);
    if (!ticketToUpdate) return;
    
    const oldStatus = ticketToUpdate.ESTADO;
    const changerUserId = userRole === 'agent' 
        ? (MOCK_USUARIOS.find(u => u.EMAIL.includes('Roberto'))?.ID_USUARIO ?? 101) 
        : ticketToUpdate.ID_USUARIO;

    setTickets(prevTickets =>
        prevTickets.map(ticket =>
            ticket.ID_TICKET === ticketId ? { ...ticket, ESTADO: newStatus as Ticket['ESTADO'], FECHA_ACTUALIZACION: new Date().toISOString() } : ticket
        )
    );
    
    if (oldStatus !== newStatus) {
        addHistoryEntry(ticketId, 'ESTADO', oldStatus, newStatus, changerUserId);
    }
  }, [tickets, userRole, addHistoryEntry]);
  
  const handleAddComment = (ticketId: number, newComment: Comentario) => {
    setComments(prevComments => [...prevComments, newComment]);

    const ticket = tickets.find(t => t.ID_TICKET === ticketId);
    const isUserComment = !MOCK_AGENTES.some(a => a.ID_USUARIO === newComment.ID_USUARIO);

    if (ticket && ticket.ESTADO === 'En Espera' && isUserComment) {
        updateTicketStatus(ticketId, 'En Progreso');
    }
  };

  const handleTicketCreate = (newTicketData: Omit<Ticket, 'ID_TICKET' | 'FECHA_CREACION' | 'FECHA_ACTUALIZACION'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      ID_TICKET: tickets.length > 0 ? Math.max(...tickets.map(t => t.ID_TICKET)) + 1 : 1,
      FECHA_CREACION: new Date().toISOString(),
      FECHA_ACTUALIZACION: new Date().toISOString(),
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
    setView('user-dashboard');
    setPreselectedAreaId(null);
  };

  const handleAssignAgent = (ticketId: number, agentId: number, role: 'Principal' | 'Secundario' | 'Colaborador') => {
      const isAlreadyAssigned = ticketAgents.some(
        ta => ta.ID_TICKET === ticketId && ta.ID_AGENTE === agentId
      );
      if (isAlreadyAssigned) return;

      const newAssignment: TicketAgente = {
          ID_TICKET: ticketId,
          ID_AGENTE: agentId,
          ROL_EN_TICKET: role,
          FECHA_ASIGNACION: new Date().toISOString(),
          ACTIVO: 'S',
      };
      setTicketAgents(prev => [...prev, newAssignment]);

      const ticket = tickets.find(t => t.ID_TICKET === ticketId);
      if (ticket && ticket.ESTADO === 'Nuevo') {
          updateTicketStatus(ticketId, 'Asignado');
      }
  };

  const handleUnassignAgent = (ticketId: number, agentId: number) => {
      const remainingAgents = ticketAgents.filter(ta => ta.ID_TICKET === ticketId && ta.ID_AGENTE !== agentId);
      setTicketAgents(prev => prev.filter(ta => !(ta.ID_TICKET === ticketId && ta.ID_AGENTE === agentId)));
      
      if (remainingAgents.length === 0) {
        const ticket = tickets.find(t => t.ID_TICKET === ticketId);
        if (ticket && ticket.ESTADO === 'Asignado') {
            updateTicketStatus(ticketId, 'Nuevo');
        }
      }
  };

  const toggleUserRole = () => {
    setUserRole(prevRole => {
      const newRole = prevRole === 'user' ? 'agent' : 'user';
      if (newRole === 'agent') {
        setView('agent-dashboard');
      } else {
        setView('user-dashboard');
      }
      setSelectedTicketId(null);
      setPreselectedAreaId(null);
      return newRole;
    });
  };

  const selectedTicket = tickets.find(t => t.ID_TICKET === selectedTicketId) || null;

  const renderContent = () => {
    switch (view) {
      case 'user-dashboard':
        return <UserDashboard onAreaSelect={handleAreaSelectForCreation} onViewMyTickets={handleViewMyTickets} />;
      case 'create':
        return <CreateTicketForm 
                  onTicketCreate={handleTicketCreate} 
                  onBack={handleBackToList}
                  preselectedAreaId={preselectedAreaId} 
                />;
      case 'detail':
        return selectedTicket ? (
          <TicketDetailView 
            ticket={selectedTicket} 
            comments={comments}
            ticketAgents={ticketAgents}
            ticketHistory={ticketHistory}
            userRole={userRole}
            onBack={handleBackToList} 
            onAddComment={handleAddComment}
            onStatusChange={updateTicketStatus}
            onAssignAgent={handleAssignAgent}
            onUnassignAgent={handleUnassignAgent}
          />
        ) : (
          <p>Ticket not found.</p>
        );
      case 'agent-dashboard':
        return <AgentDashboard 
            tickets={tickets} 
            ticketAgents={ticketAgents}
            comments={comments} 
            onTicketSelect={handleTicketSelect} 
            onAssignAgent={handleAssignAgent}
        />;
      case 'list':
      default:
        return <TicketList tickets={tickets} onTicketSelect={handleTicketSelect} onBack={handleBackToList} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header 
        onCreateTicketClick={handleCreateTicketClick} 
        userRole={userRole}
        onToggleRole={toggleUserRole} 
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;