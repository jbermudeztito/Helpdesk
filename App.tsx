import React, { useState } from 'react';
import type { Ticket, TicketAgente, TicketHistorial } from './types';
import Header from './components/Header';
import UserDashboard from './components/UserDashboard';
import AgentDashboard from './components/AgentDashboard';
import TicketList from './components/TicketList';
import TicketDetailView from './components/TicketDetailView';
import CreateTicketForm from './components/CreateTicketForm';
import { MOCK_TICKETS, MOCK_TICKET_AGENTES, MOCK_TICKET_HISTORIAL, MOCK_AGENTES, MOCK_USUARIOS } from './constants';

type View = 'USER_DASHBOARD' | 'AGENT_DASHBOARD' | 'TICKET_LIST' | 'TICKET_DETAIL' | 'CREATE_TICKET';
type UserRole = 'user' | 'agent';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [ticketAgentAssignments, setTicketAgentAssignments] = useState<TicketAgente[]>(MOCK_TICKET_AGENTES);
  const [ticketHistory, setTicketHistory] = useState<TicketHistorial[]>(MOCK_TICKET_HISTORIAL);
  const [currentView, setCurrentView] = useState<View>('USER_DASHBOARD');
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [preselectedAreaId, setPreselectedAreaId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');

  const handleCreateTicketClick = () => {
    setPreselectedAreaId(null);
    setCurrentView('CREATE_TICKET');
  };
  
  const handleAreaSelect = (areaId: number) => {
    setPreselectedAreaId(areaId);
    setCurrentView('CREATE_TICKET');
  };

  const handleTicketCreate = (newTicketData: Omit<Ticket, 'ID_TICKET' | 'FECHA_CREACION' | 'FECHA_ACTUALIZACION'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      ID_TICKET: Math.max(...tickets.map(t => t.ID_TICKET), 0) + 1,
      FECHA_CREACION: new Date().toISOString(),
      FECHA_ACTUALIZACION: new Date().toISOString(),
    };
    setTickets(prevTickets => [...prevTickets, newTicket]);
    setCurrentView(userRole === 'user' ? 'USER_DASHBOARD' : 'AGENT_DASHBOARD');
  };
  
  const handleTicketSelect = (id: number) => {
    setSelectedTicketId(id);
    setCurrentView('TICKET_DETAIL');
  };

  const handleAssignAgent = (ticketId: number, agentId: number) => {
      const isAlreadyAssigned = ticketAgentAssignments.some(
          ta => ta.ID_TICKET === ticketId && ta.ID_AGENTE === agentId && ta.ACTIVO === 'S'
      );

      if (isAlreadyAssigned) {
          console.warn("Agent already assigned to this ticket.");
          return;
      }

      const newAssignment: TicketAgente = {
          ID_TICKET: ticketId,
          ID_AGENTE: agentId,
          ROL_EN_TICKET: 'Principal', // Default role for new assignment
          FECHA_ASIGNACION: new Date().toISOString(),
          ACTIVO: 'S',
      };

      setTicketAgentAssignments(prev => [...prev, newAssignment]);

      // Update ticket status if it's 'Nuevo'
      const originalTicket = tickets.find(t => t.ID_TICKET === ticketId);
      if (originalTicket && originalTicket.ESTADO === 'Nuevo') {
          setTickets(prevTickets => prevTickets.map(ticket =>
              ticket.ID_TICKET === ticketId
                  ? { ...ticket, ESTADO: 'Asignado', FECHA_ACTUALIZACION: new Date().toISOString() }
                  : ticket
          ));
          // Add history for status change
           const statusHistoryEntry: TicketHistorial = {
              ID_HISTORIAL: Date.now() + 1, // ensure unique key
              ID_TICKET: ticketId,
              CAMPO_CAMBIADO: 'ESTADO',
              VALOR_ANTERIOR: 'Nuevo',
              VALOR_NUEVO: 'Asignado',
              FECHA_CAMBIO: new Date().toISOString(),
              ID_USUARIO: 101, // Mock agent user performing the action
          };
           setTicketHistory(prev => [...prev, statusHistoryEntry]);
      }
      
      const agent = MOCK_AGENTES.find(a => a.ID_AGENTE === agentId);
      const agentInfo = MOCK_USUARIOS.find(u => u.ID_USUARIO === agent?.ID_USUARIO);

      const assignmentHistoryEntry: TicketHistorial = {
          ID_HISTORIAL: Date.now(),
          ID_TICKET: ticketId,
          CAMPO_CAMBIADO: 'Asignación',
          VALOR_ANTERIOR: 'Sin asignar',
          VALOR_NUEVO: `Asignado a ${agentInfo?.NOMBRE || 'Agente desconocido'}`,
          FECHA_CAMBIO: new Date().toISOString(),
          ID_USUARIO: 101, // Mock agent user performing the action
      };
      setTicketHistory(prev => [...prev, assignmentHistoryEntry]);
  };


  const handleBack = () => {
     if (currentView === 'TICKET_LIST' || currentView === 'CREATE_TICKET') {
        setCurrentView(userRole === 'user' ? 'USER_DASHBOARD' : 'AGENT_DASHBOARD');
     } else if (currentView === 'TICKET_DETAIL') {
        setCurrentView(userRole === 'user' ? 'TICKET_LIST' : 'AGENT_DASHBOARD');
     } else {
        setCurrentView(userRole === 'user' ? 'USER_DASHBOARD' : 'AGENT_DASHBOARD');
     }
  };
  
  const handleViewMyTickets = () => {
      setCurrentView('TICKET_LIST');
  };

  const handleToggleRole = () => {
    setUserRole(prevRole => {
        const newRole = prevRole === 'user' ? 'agent' : 'user';
        setCurrentView(newRole === 'user' ? 'USER_DASHBOARD' : 'AGENT_DASHBOARD');
        return newRole;
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'USER_DASHBOARD':
        return <UserDashboard onAreaSelect={handleAreaSelect} onViewMyTickets={handleViewMyTickets} />;
      case 'AGENT_DASHBOARD':
        return <AgentDashboard onTicketSelect={handleTicketSelect} tickets={tickets} ticketAgentAssignments={ticketAgentAssignments} />;
      case 'TICKET_LIST':
        // For simplicity, user sees their own tickets, agent sees all.
        const userTickets = userRole === 'user' ? tickets.filter(t => t.ID_USUARIO === 1 || t.ID_USUARIO === 2 || t.ID_USUARIO === 3) : tickets;
        return <TicketList tickets={userTickets} onTicketSelect={handleTicketSelect} onBack={handleBack} />;
      case 'TICKET_DETAIL':
        return <TicketDetailView 
            ticketId={selectedTicketId!} 
            onBack={handleBack}
            userRole={userRole}
            tickets={tickets}
            ticketAgentAssignments={ticketAgentAssignments}
            ticketHistory={ticketHistory}
            onAssignAgent={handleAssignAgent}
        />;
      case 'CREATE_TICKET':
        return <CreateTicketForm onTicketCreate={handleTicketCreate} onBack={handleBack} preselectedAreaId={preselectedAreaId} />;
      default:
        return <UserDashboard onAreaSelect={handleAreaSelect} onViewMyTickets={handleViewMyTickets} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans text-gray-900 dark:text-gray-100">
      <Header 
        onCreateTicketClick={handleCreateTicketClick}
        userRole={userRole}
        onToggleRole={handleToggleRole}
      />
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;