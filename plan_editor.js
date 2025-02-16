document.addEventListener("DOMContentLoaded", () => {
    generateTable();
});

// 📌 Factores de porcentaje para cada tipo de estructura
const structureFactors = {
    "B1": [0.50, 0.30, 0.15, 0.05, 0.00],
    "B2": [0.45, 0.35, 0.15, 0.05, 0.00],
    "B3": [0.40, 0.35, 0.20, 0.05, 0.00],
    "E1": [0.35, 0.35, 0.20, 0.10, 0.00],
    "E2": [0.30, 0.35, 0.20, 0.15, 0.00],
    "C1": [0.25, 0.35, 0.20, 0.20, 0.00],
    "C2": [0.20, 0.30, 0.25, 0.25, 0.00]
};

// 📌 Generar la tabla de planificación
function generateTable() {
    let numWeeks = document.getElementById("weeks").value;
    let tableHeader = document.getElementById("weekRow");
    let planBody = document.getElementById("planBody");

    tableHeader.innerHTML = "<th>Week</th>";
    planBody.innerHTML = `
        <tr id="structureRow"><td>Structure</td></tr>
        <tr id="sessionsRow"><td>Sessions</td></tr>
        <tr id="kmPerSessionRow"><td>Km per Session</td></tr>
        <tr id="totalKmRow"><td>Total Km</td></tr>
        <tr id="zoneKmRow"><td>Km by Zone</td></tr>
    `;

    for (let i = 1; i <= numWeeks; i++) {
        // Encabezado de semanas
        let weekCell = document.createElement("th");
        weekCell.textContent = `Week ${i}`;
        tableHeader.appendChild(weekCell);

        // 📌 Selector de estructura (B1, B2, B3, etc.)
        let structureCell = document.createElement("td");
        let structureSelect = document.createElement("select");
        structureSelect.classList.add("chip-select");

        Object.keys(structureFactors).forEach(structure => {
            let option = document.createElement("option");
            option.value = structure;
            option.textContent = structure;
            structureSelect.appendChild(option);
        });

        structureSelect.addEventListener("change", updateTable);
        structureCell.appendChild(structureSelect);
        document.getElementById("structureRow").appendChild(structureCell);

        // 🔢 Número de sesiones
        let sessionsCell = document.createElement("td");
        let sessionsInput = document.createElement("input");
        sessionsInput.type = "number";
        sessionsInput.min = 3;
        sessionsInput.max = 10;
        sessionsInput.value = 6;
        sessionsInput.addEventListener("input", updateTable);
        sessionsCell.appendChild(sessionsInput);
        document.getElementById("sessionsRow").appendChild(sessionsCell);

        // 📊 Kilómetros Totales (editable)
        let kmTotalCell = document.createElement("td");
        let kmTotalInput = document.createElement("input");
        kmTotalInput.type = "number";
        kmTotalInput.value = 24; 
        kmTotalInput.addEventListener("input", updateTable);
        kmTotalCell.appendChild(kmTotalInput);
        document.getElementById("totalKmRow").appendChild(kmTotalCell);

        // 📌 Kilómetros por sesión (calculado automáticamente)
        let kmPerSessionCell = document.createElement("td");
        kmPerSessionCell.textContent = (kmTotalInput.value / sessionsInput.value).toFixed(1);
        document.getElementById("kmPerSessionRow").appendChild(kmPerSessionCell);
    }

    updateChart();
}

// 📌 Actualizar la tabla cuando se modifiquen datos
function updateTable() {
    let tableRows = document.querySelectorAll("#planTable tbody tr");
    let volumes = [];

    tableRows.forEach(row => {
        let sessions = row.children[1]?.querySelector("input")?.value || 6;
        let kmTotal = row.children[2]?.querySelector("input")?.value || 24;
        let kmPerSession = (kmTotal / sessions).toFixed(1);
        row.children[3].textContent = kmPerSession;
        volumes.push(parseFloat(kmTotal));
    });

    updateChart(volumes);
}

// 📊 Crear el gráfico con Chart.js
function updateChart(volumes = []) {
    let ctx = document.getElementById("volumeChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Array.from({ length: volumes.length }, (_, i) => `Week ${i + 1}`),
            datasets: [{
                label: "Total Km",
                data: volumes,
                backgroundColor: "rgba(0, 123, 255, 0.7)"
            }]
        }
    });
}
