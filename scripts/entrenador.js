console.log("Conectado a entrenadores.js");

$(document).ready(function () {
  // Configuración de DataTable con traducción al español
  const table = $("#entrenadoresTable").DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json", // URL de traducción al español
    },
  });

  // Petición AJAX para obtener datos de entrenadores
  $.ajax({
    url: "http://127.0.0.1:8000/api/entrenadores", // URL de la API
    method: "GET", // Método HTTP
    dataType: "json", // Tipo de datos esperados
    success: function (response) {
      console.log("Datos de entrenadores recibidos:", response);

      // Iterar sobre los datos y agregarlos a la tabla
      Object.values(response).forEach((item) => {
        // Determinar el estado basado en el valor del campo 'estado'
        const estado =
          item.estado === 1
            ? `<span class="badge bg-success">Activo</span>`
            : `<span class="badge bg-danger">Inactivo</span>`;

        // Agregar la fila a la tabla
        table.row
          .add([
            `${item.nombre} ${item.apellido}`, // Nombre completo
            item.especialidad, // Especialidad
            item.correo, // Correo
            item.telefono, // Teléfono
            estado, // Estado (Activo/Inactivo)
          ])
          .draw();
      });
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar los datos de entrenadores:", error);
    },
  });
});
