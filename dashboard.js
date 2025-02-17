document.addEventListener("DOMContentLoaded", () => {
    cargarDatos();
    renderizarGrafico();
});

function cargarDatos() {
    // Simulación de datos (en producción se debe traer de una API o Base de Datos)
    document.getElementById("totalNadadores").innerText = 10;
    document.getElementById("totalPlanes").innerText = 5;
    document.getElementById("ultimaSesion").innerText = "Hace 2 días";
}

function renderizarGrafico() {
    const ctx = document.getElementById('trainingChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Zona 1", "Zona 2", "Zona 3", "Zona 4", "Zona 5"],
            datasets: [{
                label: 'Kilómetros Entrenados',
                data: [10, 5, 3, 2, 1],
                backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e67e22", "#e74c3c"]
            }]
        }
    });
}
