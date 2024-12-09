console.log("Conectado a membresia.js");

$(document).ready(function () {
  // Configuración de DataTable con traducción al español
  const table = $("#membresiasTable").DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/2.1.8/i18n/es-MX.json",
    },
  });

  // Petición AJAX para obtener datos de membresías
  $.ajax({
    url: "http://127.0.0.1:8000/api/membresias", // URL de la API
    method: "GET", // Método HTTP
    dataType: "json", // Tipo de datos esperados
    success: function (response) {
      console.log("Datos recibidos:", response);

      // Iterar sobre los datos y agregarlos a la tabla
      Object.values(response).forEach((item) => {
        table.row
          .add([
            item.id,
            item.nombre,
            item.duracion_meses,
            `$${item.precio}`,
            item.descripcion,
          ])
          .draw();
      });
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar datos:", error);
    },
  });
});
