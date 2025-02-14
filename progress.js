document.addEventListener("DOMContentLoaded", function () {
    const eventSelect = document.getElementById("eventSelect");
    const genderSelect = document.getElementById("genderSelect");
    const poolSelect = document.getElementById("poolSelect");
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");
    const addResultButton = document.getElementById("addResult");

    let results = []; // Array per guardar els resultats

    let ctx = document.getElementById("progressChart").getContext("2d");
    let progressChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Time Progression",
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                data: [],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top"
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    reverse: true // Els temps millors són menors
                }
            }
        }
    });

    function updateChart() {
        results.sort((a, b) => new Date(a.date) - new Date(b.date));

        progressChart.data.labels = results.map(r => r.date);
        progressChart.data.datasets[0].data = results.map(r => r.time);
        
        progressChart.update();
    }

    function parseTime(timeStr) {
        let parts = timeStr.split(":");
        if (parts.length === 2) {
            let minutes = parseInt(parts[0], 10);
            let seconds = parseFloat(parts[1]);
            return minutes * 60 + seconds; // Convertir a segons
        }
        return null;
    }

    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        let secs = (seconds % 60).toFixed(2);
        return `${minutes}:${secs.padStart(5, "0")}`;
    }

    addResultButton.addEventListener("click", function () {
        let date = dateInput.value;
        let time = parseTime(timeInput.value);

        if (!date || time === null) {
            alert("Please enter a valid date and time.");
            return;
        }

        results.push({ date, time });
        updateChart();
    });
});
