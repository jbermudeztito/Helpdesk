
import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiSuggestions, AreaAtencion, Subcategoria, Prioridad, TipoTicket } from '../types';
import { MOCK_AREAS, MOCK_SUBCATEGORIAS, MOCK_PRIORIDADES, MOCK_TIPOS_TICKET } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTicketSuggestions = async (title: string, description: string): Promise<GeminiSuggestions | null> => {
  try {
    const prompt = `
      Eres un experto asistente de mesa de ayuda. Tu tarea es analizar el título y la descripción de un ticket de soporte y sugerir la categorización más adecuada.

      Información del Ticket:
      - Título: "${title}"
      - Descripción: "${description}"

      Opciones Disponibles:
      - Áreas de Atención: ${JSON.stringify(MOCK_AREAS.map(a => ({ id: a.ID_AREA, nombre: a.NOMBRE })))}
      - Subcategorías: ${JSON.stringify(MOCK_SUBCATEGORIAS.map(s => ({ id: s.ID_SUBCATEGORIA, areaId: s.ID_AREA, nombre: s.NOMBRE })))}
      - Prioridades: ${JSON.stringify(MOCK_PRIORIDADES.map(p => ({ id: p.ID_PRIORIDAD, nombre: p.NOMBRE, nivel: p.NIVEL })))}
      - Tipos de Ticket: ${JSON.stringify(MOCK_TIPOS_TICKET.map(t => ({ id: t.ID_TIPO_TICKET, nombre: t.NOMBRE })))}

      Basado en el título y la descripción, devuelve un objeto JSON con los IDs de las mejores sugerencias.
      La subcategoría sugerida DEBE pertenecer al área de atención sugerida.
      Analiza la urgencia y el impacto descrito para determinar la prioridad. Por ejemplo, si algo impide el trabajo de un usuario, la prioridad es alta o urgente. Si es una simple pregunta, es baja.
    `;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          areaId: { type: Type.NUMBER, description: "El ID del Área de Atención sugerida." },
          subcategoryId: { type: Type.NUMBER, description: "El ID de la Subcategoría sugerida." },
          priorityId: { type: Type.NUMBER, description: "El ID de la Prioridad sugerida." },
          typeId: { type: Type.NUMBER, description: "El ID del Tipo de Ticket sugerido." },
        },
        required: ['areaId', 'subcategoryId', 'priorityId', 'typeId'],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const textResponse = response.text.trim();
    if (!textResponse) {
      throw new Error("La respuesta de la API está vacía.");
    }

    const suggestions: GeminiSuggestions = JSON.parse(textResponse);
    
    // Validate suggestions
    const areaExists = MOCK_AREAS.some(a => a.ID_AREA === suggestions.areaId);
    const subcategoryExists = MOCK_SUBCATEGORIAS.some(s => s.ID_SUBCATEGORIA === suggestions.subcategoryId && s.ID_AREA === suggestions.areaId);

    if (!areaExists || !subcategoryExists) {
        console.warn("La IA sugirió una combinación de Área/Subcategoría inválida. Se intentará de nuevo o se fallará.", suggestions);
        // In a real app, you might retry or have a fallback. Here we'll just log it.
        // Forcing a valid subcategory for the suggested area if the one suggested is wrong
        if (areaExists && !subcategoryExists) {
            const firstValidSubcategory = MOCK_SUBCATEGORIAS.find(s => s.ID_AREA === suggestions.areaId);
            if(firstValidSubcategory) {
                suggestions.subcategoryId = firstValidSubcategory.ID_SUBCATEGORIA;
                return suggestions;
            }
        }
        throw new Error("Sugerencia de categoría inválida de la IA.");
    }


    return suggestions;

  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    throw new Error("No se pudieron obtener las sugerencias de la IA.");
  }
};
