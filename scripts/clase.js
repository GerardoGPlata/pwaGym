console.log("Conectado a clase.js");

// Clase para manejar las clases
class ClasesManager {
  constructor(tableSelector, apiUrl, detailUrl) {
    this.tableSelector = tableSelector;
    this.apiUrl = apiUrl;
    this.detailUrl = detailUrl;
    this.table = null; // Instancia de DataTable
  }

  // Método para inicializar DataTable
  initDataTable() {
    this.table = $(this.tableSelector).DataTable({
      language: {
        url: "//cdn.datatables.net/plug-ins/2.1.8/i18n/es-MX.json", // Cargar idioma español
      },
      columns: [
        { title: "Nombre" },
        { title: "Entrenador" },
        { title: "Descripción" },
      ],
    });

    // Agregar evento de clic a las filas
    $(this.tableSelector).on("click", "tbody tr", (event) => {
      const data = this.table.row(event.currentTarget).data();
      if (data) {
        const className = data[0]; // Nombre de la clase (columna 0)
        const classId = event.currentTarget.dataset.id; // Obtener el ID desde el atributo data-id
        console.log(`Fila clickeada: Clase ${className} con ID ${classId}`);
        this.fetchClassDetails(classId);
      }
    });
  }

  // Método para cargar datos desde la API
  loadData() {
    $.ajax({
      url: this.apiUrl,
      method: "GET",
      dataType: "json",
      success: (response) => {
        if (response.success && Array.isArray(response.data)) {
          console.log("Datos recibidos:", response.data);
          this.populateTable(response.data);
        } else {
          console.error("Respuesta inválida:", response);
        }
      },
      error: (xhr, status, error) => {
        console.error("Error al cargar datos:", error);
      },
    });
  }

  // Método para llenar la tabla con datos
  populateTable(data) {
    data.forEach((item) => {
      const entrenador = item.entrenador
        ? `${item.entrenador.nombre} ${item.entrenador.apellido}`
        : "N/A";
      const descripcion = item.clase.descripcion || "Sin descripción";

      // Indicador visual
      const detallesIcono = `<i class="fas fa-search" style="color: #007bff;"></i> Ver detalles`;

      // Añadir fila a la tabla
      this.table.row
        .add([
          item.clase.nombre,
          entrenador,
          `${descripcion} (${detallesIcono})`,
        ])
        .draw()
        .node().dataset.id = item.id; // Asignar ID de la clase como atributo data-id
    });
  }

  // Método para obtener detalles de la clase seleccionada
  fetchClassDetails(id) {
    $.ajax({
      url: `${this.detailUrl}/${id}`,
      method: "GET",
      dataType: "json",
      success: (response) => {
        if (response.success && response.data) {
          console.log("Detalles de la clase:", response.data);
          this.showDetailsModal(response.data);
        } else {
          console.error("Respuesta inválida:", response);
        }
      },
      error: (xhr, status, error) => {
        console.error("Error al cargar detalles:", error);
      },
    });
  }

  // Método para mostrar los detalles en un modal
  showDetailsModal(data) {
    const modalContent = `
      <h5>Detalles de la Clase: ${data.clase.nombre}</h5>
      <p><strong>Entrenador:</strong> ${data.entrenador.nombre} ${data.entrenador.apellido}</p>
      <p><strong>Especialidad:</strong> ${data.entrenador.especialidad}</p>
      <p><strong>Día:</strong> ${data.dia_semana}</p>
      <p><strong>Horario:</strong> ${data.hora_inicio} - ${data.hora_fin}</p>
      <p><strong>Duración:</strong> ${data.clase.duracion_min} minutos</p>
      <p><strong>Máx. Participantes:</strong> ${data.clase.max_participantes}</p>
      <p><strong>Descripción:</strong> ${data.clase.descripcion}</p>
    `;

    $("#detailsModal .modal-body").html(modalContent);
    $("#detailsModal").modal("show");
  }
}

// Inicialización al cargar la página
$(document).ready(() => {
  const apiUrl = "http://127.0.0.1:8000/api/clases"; // URL de la API para la lista
  const detailUrl = "http://127.0.0.1:8000/api/claseinf"; // URL base para detalles de clase
  const clasesManager = new ClasesManager("#clasesTable", apiUrl, detailUrl);

  clasesManager.initDataTable();
  clasesManager.loadData();
});
