document.addEventListener("DOMContentLoaded", () => {
    generateTable();
});

// 📌 Factores de porcentaje por zona para cada estructura
const structureFactors = {
    "B1": [1.00, 0.00, 0.00, 0.00, 0.00],
    "B2": [0.80, 0.19, 0.00, 0.00, 0.01],
    "B3": [0.70, 0.29, 0.00, 0.00, 0.01],
    "E1": [0.67, 0.25, 0.05, 0.01, 0.02],
    "C1": [0.50, 0.25, 0.15, 0.08, 0.02]
};

// 📌 Generar la tabla principal
function generateTable() {
    let numWeeks = document.getElementById("weeks").value;
    let tableHeader = document.getElementById("weekRow");
    let planBody = document.getElementById("planBody");
    let zoneBody = document.getElementById("zoneBody");

    // 🔄 Limpiar la tabla antes de generar una nueva
    tableHeader.innerHTML = "<th>Week</th>";
    planBody.innerHTML = `
        <tr id="structureRow"><td>Structure</td></tr>
        <tr id="sessionsRow"><td>Sessions</td></tr>
        <tr id="kmPerSessionRow"><td>Km per Session</td></tr>
        <tr id="totalKmRow"><td>Total Km</td></tr>
    `;
    zoneBody.innerHTML = "";

    for (let i = 1; i <= numWeeks; i++) {
        // 📌 Encabezado de semanas
        let weekCell = document.createElement("th");
        weekCell.textContent = `Week ${i}`;
        tableHeader.appendChild(weekCell);

        // 📌 Selector de estructura (B1, B2, etc.)
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

        // 🔢 Número de sesiones (editable)
        let sessionsCell = document.createElement("td");
        let sessionsInput = document.createElement("input");
        sessionsInput.type = "number";
        sessionsInput.min = 3;
        sessionsInput.max = 10;
        sessionsInput.value = 6;
        sessionsInput.addEventListener("input", updateTable);
        sessionsCell.appendChild(sessionsInput);
        document.getElementById("sessionsRow").appendChild(sessionsCell);

        // 📌 Kilómetros Totales (editable)
        let kmTotalCell = document.createElement("td");
        let kmTotalInput = document.createElement("input");
        kmTotalInput.type = "number";
        kmTotalInput.value = 24;
        kmTotalInput.addEventListener("input", updateTable);
        kmTotalCell.appendChild(kmTotalInput);
        document.getElementById("totalKmRow").appendChild(kmTotalCell);

        // 📌 Kilómetros por sesión (calculado automáticamente)
        let kmPerSessionCell = document.createElement("td");
        document.getElementById("kmPerSessionRow").appendChild(kmPerSessionCell);

        // 🔹 Fila de distribución por zona
        let zoneRow = document.createElement("tr");
        zoneRow.innerHTML = `<td>Week ${i}</td>
            <td class="zone1"></td>
            <td class="zone2"></td>
            <td class="zone3"></td>
            <td class="zone4"></td>
            <td class="zone5"></td>`;
        zoneBody.appendChild(zoneRow);
    }

    updateTable();
}

// 📌 Actualizar la tabla cuando se modifiquen datos
function updateTable() {
    let tableRows = document.querySelectorAll("#planTable tbody tr");
    let volumes = [];

    tableRows.forEach((row, index) => {
        if (index === 0) return;

        let structure = row.children[1]?.querySelector("select")?.value || "B1";
        let sessions = row.children[2]?.querySelector("input")?.value || 6;
        let kmTotal = row.children[3]?.querySelector("input")?.value || 24;
        let kmPerSession = (kmTotal / sessions).toFixed(1);
        row.children[4].textContent = kmPerSession;
        volumes.push(parseFloat(kmTotal));

        // 🔢 Actualizar valores de las zonas
        let zoneRow = document.querySelector(`#zoneBody tr:nth-child(${index})`);
        let factors = structureFactors[structure];

        if (zoneRow) {
            for (let i = 0; i < 5; i++) {
                zoneRow.children[i + 1].textContent = (kmTotal * factors[i]).toFixed(1);
            }
        }
    });

    updateChart(volumes);
}

// 📊 Gráfico de volumen por zona
function updateChart(volumes) {
    let ctx = document.getElementById("volumeChart").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: volumes.map((_, i) => `Week ${i + 1}`),
            datasets: [{
                label: "Total Km",
                data: volumes,
                backgroundColor: "rgba(0, 123, 255, 0.7)"
            }]
        }
    });
}
