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
// Redirigir al hacer clic en "Cerrar sesión"
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Aquí puedes limpiar datos de sesión si luego los usas
      alert("Sesión cerrada correctamente.");
      window.location.href = "index.html";
    });
  }
});

// PARA REGISTARA DENUNCIA: 
document.addEventListener('DOMContentLoaded', () => {
  const mapContainer = document.getElementById('mapContainer');
  const btnMapa = document.getElementById('btnMapa');
  const form = document.getElementById('formDenuncia');

  btnMapa.addEventListener('click', () => {
    mapContainer.textContent = 'Haga clic en el mapa para seleccionar ubicación';
    mapContainer.style.cursor = 'pointer';

    mapContainer.addEventListener('click', () => {
      mapContainer.textContent = 'Ubicación seleccionada ✓';
      mapContainer.style.backgroundColor = '#d4edda';
      mapContainer.style.color = '#155724';
      mapContainer.style.cursor = 'default';
    }, { once: true });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Denuncia enviada correctamente. Recibirá un número de seguimiento.');
  });
});
