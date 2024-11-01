import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Sidebar = () => {
  const [isConnected, setIsConnected] = useState(true); // Indicador de conexión

  return (
    <aside className="bg-gray-900 h-screen w-64 shadow-lg">
      <div className="flex flex-col h-full py-6 space-y-8">
        {/* Título del Sidebar */}
        <div className="text-gray-100 font-bold text-3xl px-6">
          Error Handling Monitor
        </div>

        {/* Indicador de Conexión */}
        <div className={`text-lg px-6 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
          {isConnected ? "Conectado" : "Desconectado"}
        </div>

        {/* Menú de Enlaces para Temas de Manejo de Errores */}
        <nav className="flex flex-col space-y-4 px-6 text-lg mt-6">
          <Link to="/error-log" className="text-gray-100 hover:text-gray-300">
            Log de Errores  
          </Link>
          <Link to="/dashboard" className="text-gray-100 hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/stats" className="text-gray-100 hover:text-gray-300">
            Estadísticas
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
