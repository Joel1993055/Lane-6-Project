document.addEventListener("DOMContentLoaded", function () {
    generateTable();
});

const zonePercentages = {
    "B1": [1, 0, 0, 0, 0],
    "B2": [0.8, 0.19, 0, 0, 0.01],
    "B3": [0.7, 0.29, 0, 0, 0.01],
    "E1": [0.67, 0.25, 0.05, 0.01, 0.02],
    "C1": [0.6, 0.25, 0.05, 0.1, 0]
};

function generateTable() {
    const weeks = parseInt(document.getElementById("weeks").value);
    const weekRow = document.getElementById("weekRow");
    const structureRow = document.getElementById("structureRow");
    const sessionsRow = document.getElementById("sessionsRow");
    const kmPerSessionRow = document.getElementById("kmPerSessionRow");
    const totalKmRow = document.getElementById("totalKmRow");
    const zoneBody = document.getElementById("zoneBody");

    weekRow.innerHTML = "<th>Week</th>";
    structureRow.innerHTML = "<td><strong>Structure</strong></td>";
    sessionsRow.innerHTML = "<td><strong>Sessions</strong></td>";
    kmPerSessionRow.innerHTML = "<td><strong>Km per Session</strong></td>";
    totalKmRow.innerHTML = "<td><strong>Total Km</strong></td>";
    zoneBody.innerHTML = "";

    for (let i = 1; i <= weeks; i++) {
        weekRow.innerHTML += `<th>Week ${i}</th>`;

        structureRow.innerHTML += `
            <td>
                <select class="structure-select" data-week="${i}">
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="B3">B3</option>
                    <option value="E1">E1</option>
                    <option value="C1">C1</option>
                </select>
            </td>`;

        sessionsRow.innerHTML += `<td><input type="number" class="sessions" data-week="${i}" value="6"></td>`;
        kmPerSessionRow.innerHTML += `<td><input type="number" class="kmPerSession" data-week="${i}" value="4.0" readonly></td>`;
        totalKmRow.innerHTML += `<td><input type="number" class="totalKm" data-week="${i}" value="24"></td>`;

        let row = `<tr><td><strong>Week ${i}</strong></td>`;
        for (let j = 0; j < 5; j++) {
            row += `<td class="zoneData" data-week="${i}" data-zone="${j}">0.0</td>`;
        }
        row += `</tr>`;
        zoneBody.innerHTML += row;
    }

    document.querySelectorAll(".sessions, .totalKm, .structure-select").forEach(el => {
        el.addEventListener("input", updateTable);
    });

    updateTable();
}

function updateTable() {
    const weeks = parseInt(document.getElementById("weeks").value);
    let zoneTotals = [[], [], [], [], []];

    for (let i = 1; i <= weeks; i++) {
        const sessionsInput = document.querySelector(`.sessions[data-week="${i}"]`);
        const kmPerSessionInput = document.querySelector(`.kmPerSession[data-week="${i}"]`);
        const totalKmInput = document.querySelector(`.totalKm[data-week="${i}"]`);
        const structureSelect = document.querySelector(`.structure-select[data-week="${i}"]`).value;

        const totalKm = parseFloat(totalKmInput.value);
        const sessions = parseInt(sessionsInput.value);

        if (!isNaN(totalKm) && !isNaN(sessions) && sessions > 0) {
            const kmPerSession = (totalKm / sessions).toFixed(1);
            kmPerSessionInput.value = kmPerSession;

            for (let z = 0; z < 5; z++) {
                const zoneValue = (totalKm * zonePercentages[structureSelect][z]).toFixed(1);
                document.querySelector(`.zoneData[data-week="${i}"][data-zone="${z}"]`).innerText = zoneValue;
                zoneTotals[z][i - 1] = parseFloat(zoneValue);
            }
        }
    }

    updateChart(zoneTotals);
}

function updateChart(zoneTotals) {
    const ctx = document.getElementById("zoneChart").getContext("2d");
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Array.from({ length: zoneTotals[0].length }, (_, i) => `Week ${i + 1}`),
            datasets: [
                { label: "Zone 1", data: zoneTotals[0], backgroundColor: "rgba(54, 162, 235, 0.7)" },
                { label: "Zone 2", data: zoneTotals[1], backgroundColor: "rgba(75, 192, 192, 0.7)" },
                { label: "Zone 3", data: zoneTotals[2], backgroundColor: "rgba(255, 206, 86, 0.7)" },
                { label: "Zone 4", data: zoneTotals[3], backgroundColor: "rgba(255, 159, 64, 0.7)" },
                { label: "Zone 5", data: zoneTotals[4], backgroundColor: "rgba(255, 99, 132, 0.7)" }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
}
