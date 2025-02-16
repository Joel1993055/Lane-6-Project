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
    zoneBody.innerHTML = `
        <tr id="zone1Row"><td>Zone 1</td></tr>
        <tr id="zone2Row"><td>Zone 2</td></tr>
        <tr id="zone3Row"><td>Zone 3</td></tr>
        <tr id="zone4Row"><td>Zone 4</td></tr>
        <tr id="zone5Row"><td>Zone 5</td></tr>
    `;

    for (let i = 1; i <= numWeeks; i++) {
        // 📌 Encabezado de semanas
        let weekCell = document.createElement("th");
        weekCell.textContent = `Week ${i}`;
        tableHeader.appendChild(weekCell);

        // 📌 Selector de estructura
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

        // 🔹 Agregar celdas vacías en la tabla de zonas
        document.getElementById("zone1Row").appendChild(document.createElement("td"));
        document.getElementById("zone2Row").appendChild(document.createElement("td"));
        document.getElementById("zone3Row").appendChild(document.createElement("td"));
        document.getElementById("zone4Row").appendChild(document.createElement("td"));
        document.getElementById("zone5Row").appendChild(document.createElement("td"));
    }

    updateTable();
}

// 📌 Actualizar la tabla y calcular zonas
function updateTable() {
    let tableRows = document.querySelectorAll("#planTable tbody tr");

    tableRows.forEach((row, index) => {
        if (index === 0) return;

        let structure = row.children[1]?.querySelector("select")?.value || "B1";
        let sessions = row.children[2]?.querySelector("input")?.value || 6;
        let kmTotal = row.children[3]?.querySelector("input")?.value || 24;
        let kmPerSession = (kmTotal / sessions).toFixed(1);
        row.children[4].textContent = kmPerSession;

        let factors = structureFactors[structure];

        for (let i = 0; i < 5; i++) {
            document.getElementById(`zone${i + 1}Row`).children[index + 1].textContent = (kmTotal * factors[i]).toFixed(1);
        }
    });
}
