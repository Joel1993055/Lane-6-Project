document.getElementById("methodSelect").addEventListener("change", function() {
    let method = this.value;
    document.getElementById("input1500m").style.display = method === "1500m" ? "block" : "none";
    document.getElementById("input20m").style.display = method === "test20" ? "block" : "none";
});

document.getElementById("calculateButton").addEventListener("click", function() {
    let method = document.getElementById("methodSelect").value;
    let pace100m = 0;

    if (method === "1500m") {
        let time1500 = document.getElementById("time1500").value;
        pace100m = calculatePaceFrom1500m(time1500);
    } else {
        let distance20m = parseFloat(document.getElementById("distance20m").value);
        pace100m = calculatePaceFrom20mTest(distance20m);
    }

    if (pace100m) {
        displayTrainingPaces(pace100m);
    }
});

function calculatePaceFrom1500m(time1500) {
    let parts = time1500.split(":");
    if (parts.length !== 2) return null;

    let minutes = parseInt(parts[0]);
    let seconds = parseFloat(parts[1]);
    let totalSeconds = minutes * 60 + seconds;

    return totalSeconds / 15;  // Pace per 100m
}

function calculatePaceFrom20mTest(distance) {
    let pacePer100m = (20 * 60) / distance * 100;
    return pacePer100m;
}

function displayTrainingPaces(pace100m) {
    let zones = {
        "AE1 - Aerobic Easy": pace100m * 1.2,
        "AE2 - Aerobic Moderate": pace100m * 1.1,
        "EN1 - Threshold 1": pace100m,
        "EN2 - Threshold 2": pace100m * 0.95,
        "EN3 - Threshold 3": pace100m * 0.90,
        "VO2 Max - Maximal Effort": pace100m * 0.85
    };

    let tableBody = document.getElementById("resultsBody");
    tableBody.innerHTML = "";

    for (let zone in zones) {
        let row = `<tr><td>${zone}</td><td>${formatTime(zones[zone])}</td></tr>`;
        tableBody.innerHTML += row;
    }
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = (seconds % 60).toFixed(2);
    return `${minutes}:${secs}`;
}
