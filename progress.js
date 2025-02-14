document.getElementById("calculateProgress").addEventListener("click", function () {
    let times = [];
    let dates = [];
    
    for (let i = 1; i <= 4; i++) {
        let timeInput = document.getElementById(`time${i}`).value.trim();
        let dateInput = document.getElementById(`date${i}`).value.trim();
        
        if (timeInput !== "" && dateInput !== "") {
            times.push(convertTimeToSeconds(timeInput));
            dates.push(dateInput);
        }
    }

    if (times.length < 2) {
        alert("Please enter at least two times with dates.");
        return;
    }

    let improvements = calculateImprovements(times);
    
    updateChart(dates, times);
    displayImprovements(improvements);
});

function convertTimeToSeconds(time) {
    let parts = time.split(":");
    if (parts.length === 2) {
        let minutes = parseFloat(parts[0]);
        let seconds = parseFloat(parts[1]);
        return minutes * 60 + seconds;
    } else {
        return parseFloat(time);
    }
}

function calculateImprovements(times) {
    let improvements = [];
    for (let i = 1; i < times.length; i++) {
        let diff = times[i - 1] - times[i];
        let percent = ((diff / times[i - 1]) * 100).toFixed(2);
        improvements.push(`From Test ${i} to ${i + 1}: ${percent}%`);
    }
    return improvements;
}

function updateChart(labels, times) {
    let ctx = document.getElementById("progressChart").getContext("2d");
    if (window.progressChart) {
        window.progressChart.destroy();
    }

    window.progressChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Time (seconds)",
                data: times,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: false }
            }
        }
    });
}

function displayImprovements(improvements) {
    document.getElementById("improvementText").innerHTML = improvements.join("<br>");
}

document.getElementById("downloadPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    let event = document.getElementById("eventSelect").value;
    let pool = document.getElementById("poolSelect").value;
    let gender = document.getElementById("genderSelect").value;

    doc.text("Progress Report", 10, 10);
    doc.text(`Event: ${event}`, 10, 20);
    doc.text(`Pool Type: ${pool}`, 10, 30);
    doc.text(`Gender: ${gender}`, 10, 40);

    let times = [];
    let dates = [];
    for (let i = 1; i <= 4; i++) {
        let timeInput = document.getElementById(`time${i}`).value.trim();
        let dateInput = document.getElementById(`date${i}`).value.trim();
        
        if (timeInput !== "" && dateInput !== "") {
            times.push(timeInput);
            dates.push(dateInput);
        }
    }

    times.forEach((time, index) => {
        doc.text(`${dates[index]} - Test ${index + 1}: ${time}`, 10, 50 + (index * 10));
    });

    doc.text("Improvement Percentages:", 10, 90);
    let improvements = calculateImprovements(times.map(convertTimeToSeconds));
    improvements.forEach((imp, index) => {
        doc.text(imp, 10, 100 + (index * 10));
    });

    doc.save("Progress_Report.pdf");
});
