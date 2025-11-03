import React, { useState, useEffect } from 'react';
import type { Ticket, AreaAtencion, Subcategoria, Prioridad, TipoTicket, GeminiSuggestions } from '../types';
import { MOCK_AREAS, MOCK_SUBCATEGORIAS, MOCK_PRIORIDADES, MOCK_TIPOS_TICKET, MOCK_OFICINAS } from '../constants';
import { getTicketSuggestions } from '../services/geminiService';
import { SparklesIcon, ArrowLeftIcon } from './common/Icons';
import Spinner from './common/Spinner';

interface CreateTicketFormProps {
  onTicketCreate: (newTicketData: Omit<Ticket, 'ID_TICKET' | 'FECHA_CREACION' | 'FECHA_ACTUALIZACION'>) => void;
  onBack: () => void;
  preselectedAreaId?: number | null;
}

const CreateTicketForm: React.FC<CreateTicketFormProps> = ({ onTicketCreate, onBack, preselectedAreaId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [areaId, setAreaId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [priorityId, setPriorityId] = useState<string>('');
  const [typeId, setTypeId] = useState<string>('');
  const [oficinaId, setOficinaId] = useState<string>('');

  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategoria[]>([]);

  useEffect(() => {
    if (preselectedAreaId) {
      setAreaId(preselectedAreaId.toString());
    }
  }, [preselectedAreaId]);

  useEffect(() => {
    if (areaId) {
      setAvailableSubcategories(MOCK_SUBCATEGORIAS.filter(sc => sc.ID_AREA === parseInt(areaId)));
      // Do not reset subcategory if it belongs to the new area
      const currentSubcategory = MOCK_SUBCATEGORIAS.find(sc => sc.ID_SUBCATEGORIA === parseInt(subcategoryId));
      if (currentSubcategory && currentSubcategory.ID_AREA !== parseInt(areaId)) {
          setSubcategoryId('');
      }
    } else {
      setAvailableSubcategories([]);
      setSubcategoryId('');
    }
  }, [areaId, subcategoryId]);
  
  const handleGetSuggestions = async () => {
    if (!title || !description) {
      setError("Por favor, ingrese un título y una descripción.");
      return;
    }
    setError(null);
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await getTicketSuggestions(title, description);
      if (suggestions) {
        setAreaId(suggestions.areaId.toString());
        setSubcategoryId(suggestions.subcategoryId.toString());
        setPriorityId(suggestions.priorityId.toString());
        setTypeId(suggestions.typeId.toString());
      }
    } catch (err) {
      setError("Error al obtener sugerencias de la IA. Por favor, intente de nuevo.");
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !areaId || !subcategoryId || !priorityId || !typeId || !oficinaId) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    // Mock user
    const newTicketData = {
      TITULO: title,
      DESCRIPCION: description,
      ID_AREA: parseInt(areaId),
      ID_SUBCATEGORIA: parseInt(subcategoryId),
      ID_PRIORIDAD: parseInt(priorityId),
      ID_TIPO_TICKET: parseInt(typeId),
      ESTADO: 'Nuevo' as 'Nuevo',
      ID_USUARIO: 1, // Mock user
      ID_OFICINA: parseInt(oficinaId),
      FECHA_CIERRE: undefined
    };
    onTicketCreate(newTicketData);
  };
  
  const canSubmit = title && description && areaId && subcategoryId && priorityId && typeId && oficinaId;

  return (
    <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4">
            <ArrowLeftIcon className="w-5 h-5"/>
            Volver al portal
        </button>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 border-b pb-4 border-gray-200 dark:border-gray-700">Crear Nuevo Ticket</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500" required/>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500" required></textarea>
              </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
             <div className="mb-6">
                <label htmlFor="oficina" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Oficina desde donde reporta</label>
                <select id="oficina" value={oficinaId} onChange={(e) => setOficinaId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" required>
                    <option value="">Seleccione su oficina</option>
                    {MOCK_OFICINAS.map(oficina => <option key={oficina.ID_OFICINA} value={oficina.ID_OFICINA}>{oficina.NOMBRE}</option>)}
                </select>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Categorización</h3>
                <button type="button" onClick={handleGetSuggestions} disabled={isLoadingSuggestions || !title || !description} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                  {isLoadingSuggestions ? <Spinner/> : <SparklesIcon className="h-5 w-5 mr-2"/>}
                  {isLoadingSuggestions ? 'Analizando...' : 'Sugerencias IA'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Área de Atención</label>
                  <select id="area" value={areaId} onChange={(e) => setAreaId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" required>
                    <option value="">Seleccione un área</option>
                    {MOCK_AREAS.map(area => <option key={area.ID_AREA} value={area.ID_AREA}>{area.NOMBRE}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcategoría</label>
                  <select id="subcategory" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" disabled={!areaId} required>
                    <option value="">Seleccione una subcategoría</option>
                    {availableSubcategories.map(sub => <option key={sub.ID_SUBCATEGORIA} value={sub.ID_SUBCATEGORIA}>{sub.NOMBRE}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridad</label>
                  <select id="priority" value={priorityId} onChange={(e) => setPriorityId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" required>
                    <option value="">Seleccione una prioridad</option>
                    {MOCK_PRIORIDADES.map(prio => <option key={prio.ID_PRIORIDAD} value={prio.ID_PRIORIDAD}>{prio.NOMBRE}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Ticket</label>
                  <select id="type" value={typeId} onChange={(e) => setTypeId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700" required>
                    <option value="">Seleccione un tipo</option>
                    {MOCK_TIPOS_TICKET.map(type => <option key={type.ID_TIPO_TICKET} value={type.ID_TIPO_TICKET}>{type.NOMBRE}</option>)}
                  </select>
                </div>
            </div>
          </div>
            
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="submit" disabled={!canSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed">
              Crear Ticket
            </button>
          </div>
        </form>
    </div>
  );
};

export default CreateTicketForm;