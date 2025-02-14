document.getElementById("calculateButton").addEventListener("click", function () {
    const method = document.getElementById("methodSelect").value;
    let paceData = [];

    if (method === "1500m") {
        const time1500 = document.getElementById("time1500").value;
        if (!time1500.match(/^\d{1,2}:\d{2}\.\d{2}$/)) {
            alert("Please enter a valid 1500m time (mm:ss.ms)");
            return;
        }
        paceData = calculatePaces1500m(time1500);
    } else {
        const distance20m = parseFloat(document.getElementById("distance20m").value);
        if (isNaN(distance20m) || distance20m <= 0) {
            alert("Please enter a valid distance in meters.");
            return;
        }
        paceData = calculatePaces20m(distance20m);
    }

    displayPaces(paceData);
    document.getElementById("downloadPDF").style.display = "block";
});

function calculatePaces1500m(time1500) {
    const totalSeconds = convertTimeToSeconds(time1500);
    const pacePer100m = totalSeconds / 15; 

    return [
        { zone: "AE1 - Aerobic Easy", pace: formatPace(pacePer100m * 1.07) },
        { zone: "AE2 - Aerobic Moderate", pace: formatPace(pacePer100m * 0.92) },
        { zone: "EN1 - Threshold 1", pace: formatPace(pacePer100m * 0.83) },
        { zone: "EN2 - Threshold 2", pace: formatPace(pacePer100m * 0.78) },
        { zone: "EN3 - Threshold 3", pace: formatPace(pacePer100m * 0.73) },
        { zone: "VO2 Max - Maximal Effort", pace: formatPace(pacePer100m * 0.68) }
    ];
}

function calculatePaces20m(distance) {
    const pacePer100m = (1200 / distance) * 100;

    return [
        { zone: "AE1 - Aerobic Easy", pace: formatPace(pacePer100m * 1.07) },
        { zone: "AE2 - Aerobic Moderate", pace: formatPace(pacePer100m * 0.92) },
        { zone: "EN1 - Threshold 1", pace: formatPace(pacePer100m * 0.83) },
        { zone: "EN2 - Threshold 2", pace: formatPace(pacePer100m * 0.78) },
        { zone: "EN3 - Threshold 3", pace: formatPace(pacePer100m * 0.73) },
        { zone: "VO2 Max - Maximal Effort", pace: formatPace(pacePer100m * 0.68) }
    ];
}

function convertTimeToSeconds(time) {
    const parts = time.split(":");
    const minutes = parseInt(parts[0], 10);
    const seconds = parseFloat(parts[1]);
    return minutes * 60 + seconds;
}

function formatPace(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60).toFixed(2);
    return `${min}:${sec.padStart(5, "0")}`;
}

function displayPaces(paceData) {
    const tableBody = document.getElementById("resultsBody");
    tableBody.innerHTML = "";
    
    paceData.forEach(item => {
        let row = `<tr><td>${item.zone}</td><td>${item.pace}</td></tr>`;
        tableBody.innerHTML += row;
    });
}

// PDF GENERATION
document.getElementById("downloadPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.text("Training Paces", 10, 10);
    
    let startY = 20;
    document.querySelectorAll("#resultsTable tbody tr").forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 2) {
            const text = `${columns[0].innerText}: ${columns[1].innerText}`;
            pdf.text(text, 10, startY);
            startY += 10;
        }
    });

    pdf.save("Training_Paces.pdf");
});
