document.addEventListener("DOMContentLoaded", function () {
    const methodSelect = document.getElementById("methodSelect");
    const input1500m = document.getElementById("input1500m");
    const input20m = document.getElementById("input20m");
    const time1500Input = document.getElementById("time1500");
    const distance20mInput = document.getElementById("distance20m");
    const calculateButton = document.getElementById("calculateButton");
    const resultsBody = document.getElementById("resultsBody");
    const resultsTable = document.getElementById("resultsTable");
    const downloadButton = document.getElementById("downloadPDF");

    // Ocultar/mostrar inputs según el método seleccionado
    methodSelect.addEventListener("change", function () {
        if (methodSelect.value === "1500m") {
            input1500m.style.display = "block";
            input20m.style.display = "none";
        } else {
            input1500m.style.display = "none";
            input20m.style.display = "block";
        }
    });

    // Función para calcular ritmos
    function calculatePaces() {
        let pace100m;

        if (methodSelect.value === "1500m") {
            const time1500 = time1500Input.value.trim();
            if (!time1500.match(/^\d{1,2}:\d{2}\.\d{2}$/)) {
                alert("Please enter a valid 1500m time (mm:ss.ms)");
                return;
            }
            pace100m = convertTimeToSeconds(time1500) / 15; // 1500m → 100m pace
        } else {
            const distance20m = parseFloat(distance20mInput.value);
            if (isNaN(distance20m) || distance20m <= 0) {
                alert("Please enter a valid distance for the 20-minute test");
                return;
            }
            pace100m = (1200 / distance20m) * 100; // 1200 sec in 20 min → 100m pace
        }

        // Calcular zonas de entrenamiento con valores corregidos
        const trainingPaces = {
            "AE1 - Aerobic Easy": pace100m * 1.15,
            "AE2 - Aerobic Moderate": pace100m * 1.05,
            "EN1 - Threshold 1": pace100m,
            "EN2 - Threshold 2": pace100m * 0.95,
            "EN3 - Threshold 3": pace100m * 0.90,
            "VO2 Max - Maximal Effort": pace100m * 0.85
        };

        // Limpiar tabla y mostrar resultados
        resultsBody.innerHTML = "";
        Object.entries(trainingPaces).forEach(([zone, time]) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${zone}</td><td>${convertSecondsToTime(time)}</td>`;
            resultsBody.appendChild(row);
        });

        resultsTable.style.display = "table"; // Mostrar tabla de resultados
        downloadButton.style.display = "inline-block"; // Mostrar botón de descarga
    }

    // Convertir tiempo a segundos
    function convertTimeToSeconds(time) {
        const [minutes, rest] = time.split(":");
        const [seconds, milliseconds] = rest.split(".");
        return parseInt(minutes) * 60 + parseInt(seconds) + parseFloat("0." + milliseconds);
    }

    // Convertir segundos a formato mm:ss.ms
    function convertSecondsToTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(2);
        return `${minutes}:${remainingSeconds.padStart(5, "0")}`;
    }

    // Descargar PDF solo con la tabla de resultados
    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Training Paces", 10, 10);

        const data = [];
        document.querySelectorAll("#resultsBody tr").forEach(row => {
            const cells = row.querySelectorAll("td");
            data.push([cells[0].innerText, cells[1].innerText]);
        });

        doc.autoTable({
            head: [["Zone", "Pace per 100m"]],
            body: data,
            startY: 20
        });

        doc.save("Training_Paces.pdf");
    }

    calculateButton.addEventListener("click", calculatePaces);
    downloadButton.addEventListener("click", downloadPDF);
});
