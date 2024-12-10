console.log("Conectado a usuarios.js");

$(document).ready(function () {
  // Configuración de DataTable con traducción al español
  const table = $("#usuariosTable").DataTable({
    language: {
      url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json", // URL de traducción al español
    },
  });

  // Petición AJAX para obtener datos de usuarios
  $.ajax({
    url: "http://127.0.0.1:8000/api/users", // URL de la API
    method: "GET", // Método HTTP
    dataType: "json", // Tipo de datos esperados
    success: function (response) {
      console.log("Datos de usuarios recibidos:", response);

      // Iterar sobre los datos y agregarlos a la tabla
      Object.values(response).forEach((item) => {
        // Determinar el estado basado en el valor del campo 'status'
        const estado =
          item.status.type === "Activo"
            ? `<span class="badge bg-success">Activo</span>`
            : `<span class="badge bg-danger">Inactivo</span>`;

        // Formatear la fecha de nacimiento
        const fechaNacimiento = new Date(item.birth_date).toLocaleDateString(
          "es-ES",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        // Agregar la fila a la tabla
        table.row
          .add([
            item.name, // Nombre
            item.email, // Correo
            item.phone, // Teléfono
            fechaNacimiento, // Fecha de nacimiento
            estado, // Estado (Activo/Inactivo)
          ])
          .draw();
      });
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar los datos de usuarios:", error);
    },
  });

  // Evento para abrir el modal de agregar usuario
  $("#addUserModal").on("show.bs.modal", function () {
    console.log("El modal 'Agregar Usuario' se ha abierto.");
  });

  // Asignar evento al botón de "Agregar Usuario"
  $(".btn-primary").on("click", function () {
    $("#addUserModal").modal("show");
  });

  // Manejar el evento de envío del formulario
  $("#addUserForm").on("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario recargue la página

    const $submitButton = $("#submitButton"); // Referencia al botón de submit

    // Cambiar estado del botón a deshabilitado y mostrar cargando
    $submitButton
      .html(
        `
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      Cargando...
    `
      )
      .prop("disabled", true);

    // Obtener los datos del formulario
    const formData = $(this).serializeArray();
    const params = formData
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join("&");

    // Realizar la petición POST
    $.ajax({
      url: `http://127.0.0.1:8000/api/users/cUser?${params}`, // Construir URL con los parámetros
      method: "POST",
      success: function (response) {
        console.log("Usuario creado exitosamente:", response);

        // Mostrar alerta de éxito
        const successAlert = `
          <div class="alert alert-success" role="alert">
            <i data-feather="check-circle"></i>
            Usuario creado exitosamente.
          </div>`;
        $(".modal-body").prepend(successAlert);
        feather.replace(); // Actualizar íconos de Feather

        // Cerrar el modal y recargar página después de 2 segundos
        setTimeout(() => {
          $("#addUserModal").modal("hide");
          $(".alert").remove(); // Eliminar alerta
          window.location.href = "/pages/usuarios.html"; // Recargar página
        }, 2000);
      },
      error: function (xhr) {
        console.error("Error al crear usuario:", xhr);

        // Obtener los mensajes de error
        const response = xhr.responseJSON;
        const errors = response.error;

        // Construir alerta de error
        let errorMessages = "";
        Object.entries(errors).forEach(([key, messages]) => {
          messages.forEach((message) => {
            errorMessages += `<li>${message}</li>`;
          });
        });

        const errorAlert = `
          <div class="alert alert-danger" role="alert">
            <i data-feather="alert-circle"></i>
            <strong>Error:</strong> ${response.msg}
            <ul>${errorMessages}</ul>
          </div>`;
        $(".modal-body").prepend(errorAlert);
        feather.replace(); // Actualizar íconos de Feather

        // Eliminar alerta después de 5 segundos
        setTimeout(() => $(".alert").remove(), 5000);
      },
      complete: function () {
        // Rehabilitar botón y restaurar texto original
        $submitButton.html("Guardar Usuario").prop("disabled", false);
      },
    });
  });
});
