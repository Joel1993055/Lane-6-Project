document.addEventListener("DOMContentLoaded", () => {
    generateTable();
});

function generateTable() {
    const weeks = document.getElementById("weeks").value;
    const weekRow = document.getElementById("weekRow");
    const structureRow = document.getElementById("structureRow");
    const sessionsRow = document.getElementById("sessionsRow");
    const kmPerSessionRow = document.getElementById("kmPerSessionRow");
    const totalKmRow = document.getElementById("totalKmRow");
    const zoneKmRow = document.getElementById("zoneKmRow");

    weekRow.innerHTML = "<th>Week</th>";
    structureRow.innerHTML = "<td>Structure</td>";
    sessionsRow.innerHTML = "<td>Sessions</td>";
    kmPerSessionRow.innerHTML = "<td>Km per Session</td>";
    totalKmRow.innerHTML = "<td>Total Km</td>";
    zoneKmRow.innerHTML = "<td>Km by Zone</td>";

    for (let i = 1; i <= weeks; i++) {
        weekRow.innerHTML += `<th>Week ${i}</th>`;
        structureRow.innerHTML += `<td><select class="weekType">
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="B3">B3</option>
            <option value="E1">E1</option>
            <option value="C">C</option>
        </select></td>`;
        sessionsRow.innerHTML += `<td><input type="number" class="sessions" value="6" min="1" max="10"></td>`;
        kmPerSessionRow.innerHTML += `<td><input type="number" class="kmPerSession" value="4.0" step="0.1"></td>`;
        totalKmRow.innerHTML += `<td class="totalKm">0</td>`;
        zoneKmRow.innerHTML += `<td class="zoneKm">0</td>`;
    }

    updateCalculations();
    addListeners();
}

function updateCalculations() {
    document.querySelectorAll("#planTable tbody tr").forEach((row, index) => {
        if (index >= 2) { // Skip header and structure rows
            row.querySelectorAll("td input").forEach(input => {
                input.addEventListener("input", () => {
                    const weekCells = document.querySelectorAll(".totalKm");
                    weekCells.forEach(cell => {
                        const sessions = cell.parentNode.querySelector(".sessions").value;
                        const kmPerSession = cell.parentNode.querySelector(".kmPerSession").value;
                        cell.textContent = (sessions * kmPerSession).toFixed(1);
                    });
                });
            });
        }
    });
}

function exportPlan() {
    let csvContent = "Week,Type,Sessions,Km per Session,Total Km,Km by Zone\n";
    document.querySelectorAll("#planTable tbody tr").forEach(row => {
        let rowData = [];
        row.querySelectorAll("td").forEach(cell => {
            let input = cell.querySelector("input, select");
            rowData.push(input ? input.value : cell.textContent);
        });
        csvContent += rowData.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "training_plan.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
