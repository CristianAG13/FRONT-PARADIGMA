import { useState, useEffect } from 'react';
import { FaChartBar } from 'react-icons/fa';

const Stats = () => {
  const [errors, setErrors] = useState([]); // Datos de errores
  const [filter, setFilter] = useState("controlled"); // Filtro para estadísticas
  const [stats, setStats] = useState({ total: 0, retriable: 0, nonRetriable: 0 }); // Estadísticas calculadas
  const [loading, setLoading] = useState(true); // Estado de carga
  const [fetchError, setFetchError] = useState(""); // Error en la obtención de datos

  // Obtener todos los errores desde el backend
  useEffect(() => {
    const fetchAllErrors = async () => {
      try {
        const response = await fetch('https://pwxs1xbn-7209.use2.devtunnels.ms/api/ErrorLog');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allErrors = await response.json();
        console.log("Errores obtenidos del backend:", allErrors); // Verifica los datos
        setErrors(allErrors);
      } catch (error) {
        console.error("Error cargando los errores iniciales:", error);
        setFetchError("Error al cargar los datos de errores. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllErrors();
  }, []);

  // Calcular estadísticas basadas en los datos y el filtro
  useEffect(() => {
    if (!Array.isArray(errors) || errors.length === 0) {
      console.log("No hay errores disponibles para calcular estadísticas.");
      setStats({ total: 0, retriable: 0, nonRetriable: 0 });
      return;
    }

    console.log("Errores actuales para estadísticas:", errors);

    // Filtrar los errores según el filtro seleccionado
    const filteredErrors = errors.filter((error) =>
      filter === "controlled" ? error.isRetriable : !error.isRetriable
    );

    // Contar los errores reintentables y no reintentables
    const retriableCount = filteredErrors.filter((error) => error.isRetriable).length;
    const nonRetriableCount = filteredErrors.filter((error) => !error.isRetriable).length;

    console.log("Errores filtrados:", filteredErrors);
    console.log("Reintentables:", retriableCount);
    console.log("No reintentables:", nonRetriableCount);

    // Actualizar las estadísticas
    setStats({
      total: filteredErrors.length,
      retriable: retriableCount,
      nonRetriable: nonRetriableCount,
    });
  }, [filter, errors]);

  // Cambiar el filtro de estadísticas
  const handleFilterChange = (type) => {
    setFilter(type);
  };

  if (loading) return <div className="text-center text-gray-400">Cargando estadísticas...</div>;
  if (fetchError) return <div className="text-center text-red-500">{fetchError}</div>;

  console.log("Estadísticas finales:", stats); // Verifica los valores finales

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-gray-100 mb-6">Estadísticas de Errores</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <FaChartBar className="text-green-500 text-5xl mb-4 mx-auto" />
        <p className="text-gray-400 text-center mb-4">
          {filter === "controlled"
            ? "Estadísticas de errores controlados."
            : "Estadísticas de excepciones."}
        </p>

        {/* Mostrar estadísticas */}
        <div className="text-gray-100 mb-4">
          <p>
            <strong>Total:</strong> {stats.total}
          </p>
          <p>
            <strong>Reintentables:</strong> {stats.retriable}
          </p>
          <p>
            <strong>No Reintentables:</strong> {stats.nonRetriable}
          </p>
        </div>

        {/* Botones para cambiar filtro */}
        <div className="flex justify-around mt-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "controlled"
                ? "bg-green-500 text-gray-100"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => handleFilterChange("controlled")}
          >
            Errores Controlados
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${
              filter === "exception"
                ? "bg-red-500 text-gray-100"
                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
            }`}
            onClick={() => handleFilterChange("exception")}
          >
            Excepciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stats;
