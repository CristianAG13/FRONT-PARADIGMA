// src/components/ErrorLog.jsx
import { useEffect, useState, useMemo } from 'react';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

export const ErrorLog = () => {
  const [errors, setErrors] = useState([]); // Estado para almacenar los errores
  const [filter, setFilter] = useState(''); // Estado para el filtro de errores

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Función para verificar si un error ya existe en el estado
  const isErrorDuplicate = (newError, existingErrors) => {
    return existingErrors.some((error) => error.id === newError.id);
  };

  // Obtener todos los errores al cargar la página
  useEffect(() => {
    const fetchAllErrors = async () => {
      try {
        const response = await fetch('https://pwxs1xbn-7209.use2.devtunnels.ms/api/ErrorLog');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allErrors = await response.json();
        console.log("Errores obtenidos de la API inicial:", allErrors);

        // Filtrar errores duplicados antes de añadirlos al estado
        setErrors((prevErrors) => {
          const uniqueErrors = allErrors.filter(
            (error) => !isErrorDuplicate(error, prevErrors)
          );
          return [...uniqueErrors, ...prevErrors];
        });
      } catch (error) {
        console.error('Error cargando los errores iniciales:', error);
      }
    };

    fetchAllErrors();
  }, []);

  // Conectar con EventSource al montar el componente
  useEffect(() => {
    const eventSource = new EventSource('https://pwxs1xbn-7209.use2.devtunnels.ms/api/ErrorLog/stream');

    // Al recibir un mensaje, agregar el error al estado
    eventSource.onmessage = (event) => {
      try {
        const newError = JSON.parse(event.data);
        console.log("Nuevo error recibido:", newError);

        setErrors((prevErrors) => {
          // Evitar añadir errores duplicados
          if (isErrorDuplicate(newError, prevErrors)) {
            return prevErrors;
          }
          return [newError, ...prevErrors];
        });
      } catch (parseError) {
        console.error('Error al parsear el nuevo error:', parseError);
      }
    };

    // Manejar errores en EventSource
    eventSource.onerror = (err) => {
      console.error('EventSource error:', err);
      eventSource.close();
    };

    // Limpiar la conexión al desmontar el componente
    return () => {
      eventSource.close();
    };
  }, []);

  // Filtrar errores según el estado del filtro
  const filteredErrors = useMemo(() => {
    return errors.filter((error) => {
      if (filter === 'controlled') {
        return error.isRetriable === true;
      } else if (filter === 'exception') {
        return error.isRetriable === false;
      }
      return true; // Mostrar todos si no hay filtro
    });
  }, [errors, filter]);

  // Calcular la paginación
  const totalErrors = filteredErrors.length;
  const totalPages = Math.ceil(totalErrors / itemsPerPage);

  // Asegurarse de que currentPage no exceda el número de páginas
  useEffect(() => {
    if (currentPage > totalPages && totalPages !== 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const currentErrors = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    return filteredErrors.slice(startIdx, endIdx);
  }, [filteredErrors, currentPage, itemsPerPage]);

  // Generar números de página para los botones
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // Manejar el cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Manejar el cambio de items por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Resetear a la primera página
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-100">Log de Errores</h1>

      {/* Filtro de errores */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-2 md:mb-0">
          <label className="text-md text-gray-200 mr-2">Filtrar por tipo:</label>
          <select
            className="p-1 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="controlled">Errores Controlados</option>
            <option value="exception">Excepciones</option>
          </select>
        </div>

        {/* Selector de items por página */}
        <div>
          <label className="text-md text-gray-200 mr-2">Items por página:</label>
          <select
            className="p-1 bg-gray-800 text-gray-100 border border-gray-700 rounded text-sm"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Lista de Errores */}
      <div className="bg-gray-800 rounded-lg shadow p-4">
        {currentErrors.length > 0 ? (
          <>
            <ul className="space-y-2">
              {currentErrors.map((error, index) => {
                // Generar una clave única
                const uniqueKey = error.id || `${error.cardNumber}-${error.purchaseDate}-${index}`;

                return (
                  <li
                    key={uniqueKey}
                    className={`p-2 rounded-lg shadow flex items-start space-x-2 text-sm ${
                      error.isRetriable === false
                        ? 'bg-red-700 text-red-100'
                        : 'bg-green-700 text-green-100'
                    }`}
                  >
                    <div className="mt-0.5">
                      {error.isRetriable === false ? (
                        <FaExclamationTriangle className="text-lg" />
                      ) : (
                        <FaInfoCircle className="text-lg" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-2">
                        <p>
                          <strong>ID:</strong> {error.id || 'N/A'}
                        </p>
                        <p>
                          <strong>Número:</strong> {error.cardNumber || 'N/A'}
                        </p>
                        <p>
                          <strong>Compra:</strong>{' '}
                          {error.purchaseDate ? new Date(error.purchaseDate).toLocaleString() : 'N/A'}
                        </p>
                        <p>
                          <strong>Monto:</strong> ${typeof error.amount === 'number' ? error.amount.toFixed(2) : 'N/A'}
                        </p>
                        <p>
                          <strong>Estado:</strong> {error.status || 'N/A'}
                        </p>
                        <p>
                          <strong>Reintentable:</strong> {typeof error.isRetriable === 'boolean' ? (error.isRetriable ? 'Sí' : 'No') : 'N/A'}
                        </p>
                      </div>
                      <p className="mt-1">
                        <strong>Error:</strong> {error.errorMessage || 'N/A'}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Controles de Paginación */}
            <div className="mt-4 flex justify-between items-center text-xs">
              {/* Información de la página actual */}
              <div className="text-gray-300">
                Página {currentPage} de {totalPages}
              </div>

              {/* Botones de navegación */}
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-0.5 rounded ${
                    currentPage === 1
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                  }`}
                >
                  Anterior
                </button>
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-2 py-0.5 rounded ${
                      currentPage === number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-2 py-0.5 rounded ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-600 text-gray-100 hover:bg-gray-500'
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-sm">No hay errores para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default ErrorLog;
