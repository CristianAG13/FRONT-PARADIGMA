// src/components/Sidebar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaChartBar, FaTachometerAlt } from 'react-icons/fa';
import useAuth from '../auth/hooks/useAuth';

const Sidebar = () => {
  const [isConnected, setIsConnected] = useState(true); // Indicador de conexión
  const { logout } = useAuth(); // Obtiene la función logout del contexto de autenticación
  const navigate = useNavigate(); // Hook para la navegación

  /**
   * Maneja el evento de cerrar sesión.
   */
  const handleLogout = () => {
    logout(); // Llama a la función logout para actualizar el estado de autenticación
    navigate('/login'); // Redirige al usuario a la página de login
  };

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
          <Link to="/error-log" className="text-gray-100 hover:text-gray-300 flex items-center space-x-2">
            <FaExclamationTriangle />
            <span>Log de Errores</span>
          </Link>
          {/* <Link to="/dashboard" className="text-gray-100 hover:text-gray-300 flex items-center space-x-2">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link> */}
          {/* <Link to="/stats" className="text-gray-100 hover:text-gray-300 flex items-center space-x-2">
            <FaChartBar />
            <span>Estadísticas</span>
          </Link> */}
        </nav>

        {/* Botón de Logout */}
        <div className="mt-auto px-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded flex items-center justify-center space-x-2"
          >
            {/* Ícono de Logout */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
