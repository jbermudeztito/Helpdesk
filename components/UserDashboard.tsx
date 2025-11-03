import React from 'react';
import { MOCK_AREAS } from '../constants';
import { ComputerDesktopIcon, UsersIcon, CalculatorIcon, ListBulletIcon } from './common/Icons';

interface UserDashboardProps {
  onAreaSelect: (areaId: number) => void;
  onViewMyTickets: () => void;
}

const getAreaIcon = (areaName: string) => {
    switch(areaName.toLowerCase()) {
        case 'sistemas':
            return <ComputerDesktopIcon className="h-12 w-12 text-blue-500 mb-4 mx-auto" />;
        case 'recursos humanos':
            return <UsersIcon className="h-12 w-12 text-green-500 mb-4 mx-auto" />;
        case 'contabilidad':
            return <CalculatorIcon className="h-12 w-12 text-indigo-500 mb-4 mx-auto" />;
        default:
            return <div className="h-12 w-12 mb-4"></div>;
    }
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onAreaSelect, onViewMyTickets }) => {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Bienvenido al Portal de Ayuda
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
        ¿Cómo podemos ayudarte hoy? Selecciona el área con la que necesitas contactar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {MOCK_AREAS.map(area => (
          <button
            key={area.ID_AREA}
            onClick={() => onAreaSelect(area.ID_AREA)}
            className="group bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {getAreaIcon(area.NOMBRE)}
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{area.NOMBRE}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{area.DESCRIPCION}</p>
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
         <p className="text-gray-600 dark:text-gray-400 mb-4">O revisa el estado de tus solicitudes existentes.</p>
         <button
            onClick={onViewMyTickets}
            className="flex items-center justify-center mx-auto bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 transition-colors"
          >
            <ListBulletIcon className="h-5 w-5 mr-2"/>
            Ver mis tickets existentes
         </button>
      </div>
    </div>
  );
};

export default UserDashboard;