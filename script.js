function calculatePaces() {
    let inputTime = document.getElementById("time1500").value;
    
    // Convertir tiempo ingresado (mm:ss.ms) a segundos
    let timeParts = inputTime.split(":");
    if (timeParts.length !== 2) {
        alert("Indtast en gyldig tid i formatet mm:ss.ms (f.eks. 18:14.24)");
        return;
    }

    let minutes = parseInt(timeParts[0]);
    let seconds = parseFloat(timeParts[1]);
    let totalSeconds = (minutes * 60) + seconds;
    
    if (isNaN(totalSeconds) || totalSeconds <= 0) {
        alert("Indtast en gyldig tid!");
        return;
    }

    // Calcular ritmo por 100m
    let pace100m = totalSeconds / 15;

    // Definir zonas de entrenamiento (ajusta si es necesario)
    let paces = {
        "z1": pace100m * 1.15, // Z1 (suave)
        "z2": pace100m * 1.05, // Z2 (aeróbico)
        "z3": pace100m,        // Z3 (threshold)
        "z4": pace100m * 0.95, // Z4 (VO2max)
        "z5": pace100m * 0.85  // Z5 (Sprint)
    };

    // Mostrar resultados en la tabla
    Object.keys(paces).forEach(zone => {
        let minutes = Math.floor(paces[zone] / 60);
        let seconds = (paces[zone] % 60).toFixed(2);
        document.getElementById(zone).textContent = `${minutes}:${seconds.padStart(5, "0")}`;
    });
}
