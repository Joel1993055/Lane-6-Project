document.addEventListener("DOMContentLoaded", function () {
    const methodSelect = document.getElementById("methodSelect");
    const input1500m = document.getElementById("input1500m");
    const input20m = document.getElementById("input20m");
    const calculateButton = document.getElementById("calculateButton");
    const resultsBody = document.getElementById("resultsBody");
    const downloadButton = document.getElementById("downloadPDF");

    // Mostrar/Ocultar campos según método seleccionado
    methodSelect.addEventListener("change", function () {
        if (methodSelect.value === "1500m") {
            input1500m.style.display = "block";
            input20m.style.display = "none";
        } else {
            input1500m.style.display = "none";
            input20m.style.display = "block";
        }
    });

    // Función para calcular los ritmos
    function calculatePaces(time1500m, distance20m) {
        let basePacePer100;

        if (methodSelect.value === "1500m") {
            let [minutes, seconds] = time1500m.split(":").map(parseFloat);
            let totalSeconds = minutes * 60 + seconds;
            basePacePer100 = totalSeconds / 15; // 1500m → cada 100m
        } else {
            basePacePer100 = (20 * 60) / (distance20m / 100); // Test 20 min
        }

        // Ritmos de entrenamiento (ajustes porcentuales)
        const trainingZones = [
            { zone: "AE1 - Aerobic Easy", factor: 1.07 },
            { zone: "AE2 - Aerobic Moderate", factor: 1.00 },
            { zone: "EN1 - Threshold 1", factor: 0.93 },
            { zone: "EN2 - Threshold 2", factor: 0.89 },
            { zone: "EN3 - Threshold 3", factor: 0.85 },
            { zone: "VO2 Max - Maximal Effort", factor: 0.80 }
        ];

        resultsBody.innerHTML = ""; // Limpiar resultados anteriores

        trainingZones.forEach(({ zone, factor }) => {
            let pacePer100 = basePacePer100 * factor;
            let paceMinutes = Math.floor(pacePer100 / 60);
            let paceSeconds = (pacePer100 % 60).toFixed(2).padStart(5, "0");

            let row = document.createElement("tr");
            row.innerHTML = `<td>${zone}</td><td>${paceMinutes}:${paceSeconds}</td>`;
            resultsBody.appendChild(row);
        });

        // Mostrar el botón de descarga de PDF
        downloadButton.style.display = "block";
    }

    // Evento para calcular los ritmos
    calculateButton.addEventListener("click", function () {
        let time1500 = document.getElementById("time1500").value;
        let distance20m = document.getElementById("distance20m").value;

        if (methodSelect.value === "1500m" && time1500 === "") {
            alert("Please enter a valid 1500m time (mm:ss.ms)");
            return;
        }

        if (methodSelect.value === "test20" && (distance20m === "" || distance20m <= 0)) {
            alert("Please enter a valid distance for the 20-minute test.");
            return;
        }

        calculatePaces(time1500, distance20m);
    });

    // Generar PDF con jsPDF y html2canvas
    downloadButton.addEventListener("click", function () {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        // Capturar tabla como imagen
        html2canvas(document.querySelector(".container"), { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
            pdf.save("Training_Paces.pdf");
        });
    });
});
