import React from 'react';
import { PlusCircleIcon, TicketIcon, UserGroupIcon, UserIcon } from './common/Icons';

interface HeaderProps {
  onCreateTicketClick: () => void;
  userRole: 'user' | 'agent';
  onToggleRole: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateTicketClick, userRole, onToggleRole }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <TicketIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Helpdesk AI Assistant
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleRole}
            className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            {userRole === 'user' ? (
                <><UserGroupIcon className="h-5 w-5 mr-2" /> Cambiar a Vista Agente</>
            ) : (
                <><UserIcon className="h-5 w-5 mr-2" /> Cambiar a Vista Usuario</>
            )}
          </button>
          {userRole === 'user' && (
            <button
              onClick={onCreateTicketClick}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Crear Nuevo Ticket
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
