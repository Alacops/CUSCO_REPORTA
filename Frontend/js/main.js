console.log("Cusco Reporta — Página inicial cargada correctamente");

// Para iniciar sesión:
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita que la página se recargue

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Por favor, complete ambos campos.");
        return;
      }

      alert("¡Inicio de sesión exitoso!");
      // Redirigir a una página que aún no existe
      window.location.href = "panel.html";
    });
  }
});
