// CONTROL DE TIMING DE LA ANIMACIÓN (DOS FASES DE SPLASH SCREEN)
window.addEventListener('DOMContentLoaded', () => {
    const phaseApp = document.getElementById('splash-phase-app');
    const phaseGov = document.getElementById('splash-phase-gov');
    const splashScreen = document.getElementById('splash-screen');

    // Tiempo 1: Muestra el nombre de tu aplicación por 2.2 segundos
    setTimeout(() => {
        phaseApp.classList.remove('active');
        
        // Tiempo 2: Cambia al logo oficial de Querétaro por 2.2 segundos más
        setTimeout(() => {
            phaseGov.classList.add('active');
            
            // Tiempo 3: Desvanece por completo el telón y entra al Dashboard limpio
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => { 
                    splashScreen.style.visibility = 'hidden'; 
                    map.invalidateSize(); // Ajusta el mapa Leaflet correctamente
                }, 600);
            }, 2200);

        }, 400); 
    }, 2200);

    triggerNNEngine(); 
});

// Tab Switching Mechanism + Disparador de Alertas Predictivas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // DISPARADOR: Si el usuario da clic a la pestaña Neural Network, lanza la alerta interactiva
    if (tabId === 'nn-tab') {
        setTimeout(() => {
            document.getElementById('ai-notification').classList.add('show');
        }, 300); // Pequeña espera para efecto dinámico
    } else {
        // Oculta la notificación si regresa a Routing Center
        document.getElementById('ai-notification').classList.remove('show');
    }
}

// Funciones para cerrar de forma manual la notificación en el botón "×"
function closeNotification() {
    document.getElementById('ai-notification').classList.remove('show');
}

// Interactive Neural Network Sandbox Logic
function triggerNNEngine() {
    const selector = document.getElementById('time-selector').value;
    const outputBox = document.getElementById('nn-output');
    
    if (selector === 'weekday-rush') {
        outputBox.innerHTML = "<strong>Result:</strong> Routine Confirmed.<br>📍 Destination: <strong>Centro Sur (Workplace)</strong>.<br>🔮 Recommendation: Route B active due to 5 de Febrero saturation forecasts.";
        outputBox.style.borderLeftColor = "var(--qro-blue)";
    } else if (selector === 'weekend-morning') {
        outputBox.innerHTML = "<strong>Result:</strong> Anomaly Detected (Non-routine trip).<br>📍 Destination: <strong>Antea / Juriquilla Shopping Hub</strong>.<br>🔮 Recommendation: Open routing active. High network bandwidth available.";
        outputBox.style.borderLeftColor = "var(--qro-green)";
    } else if (selector === 'night-shift') {
        outputBox.innerHTML = "<strong>Result:</strong> Alternate Cluster Node found.<br>📍 Destination: <strong>Pénjamo Logistics Area</strong>.<br>🔮 Recommendation: Long distance highway optimization protocols activated.";
        outputBox.style.borderLeftColor = "#8b5cf6"; 
    }
}

// --- LEAFLET MAP INITIALIZATION ---
const map = L.map('map', {zoomControl: false}).setView([20.6200, -100.3900], 12);
L.control.zoom({position: 'topright'}).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO'
}).addTo(map);

const originJuriquilla = [20.6900, -100.4450];
const destCentroSur = [20.5630, -100.3630];

L.circleMarker(originJuriquilla, {radius: 8, color: '#0066ff', fillColor: '#0066ff', fillOpacity: 0.9}).addTo(map).bindPopup('<b>Origin Node:</b> Juriquilla');
L.circleMarker(destCentroSur, {radius: 8, color: '#00cc99', fillColor: '#00cc99', fillOpacity: 0.9}).addTo(map).bindPopup('<b>Destination Node:</b> Centro Sur');

let activeNetworkLayers = [];

function clearNetwork() {
    activeNetworkLayers.forEach(layer => map.removeLayer(layer));
    activeNetworkLayers = [];
}

function runIndividualRouting() {
    clearNetwork();
    document.getElementById('token-count').innerText = "0.00 QRO";
    document.getElementById('system-status').innerText = "CRITICAL SATURATION";
    document.getElementById('system-status').style.backgroundColor = "#fee2e2";
    document.getElementById('system-status').style.color = "#ef4444";
    document.getElementById('status-desc').innerHTML = "<strong>Result:</strong> Standard navigation apps sent 100% of vehicles through the exact same route. Massive gridlock. Average speed: 11 km/h.";

    const heavyCongestionPath = [originJuriquilla, [20.6550, -100.4250], [20.6150, -100.4050], [20.5850, -100.3800], destCentroSur];
    const polyline = L.polyline(heavyCongestionPath, {color: '#ef4444', weight: 6, opacity: 0.85, dashArray: '8, 8'}).addTo(map);
    activeNetworkLayers.push(polyline);
}

function runCollaborativeRouting() {
    clearNetwork();
    document.getElementById('token-count').innerText = "+25.50 QRO";
    document.getElementById('system-status').innerText = "BALANCED & EFFICIENT";
    document.getElementById('system-status').style.backgroundColor = "#d1fae5";
    document.getElementById('system-status').style.color = "#065f46";
    document.getElementById('status-desc').innerHTML = "<strong>Result:</strong> AI decentralized traffic footprint: 40% via Bernardo Quintana, 35% via Libramiento, 25% on main artery. Network flow optimal.";

    const pathBQ = [originJuriquilla, [20.6650, -100.4000], [20.6100, -100.3700], [20.5800, -100.3600], destCentroSur];
    const pathLibramiento = [originJuriquilla, [20.6600, -100.4700], [20.5900, -100.4600], [20.5500, -100.4100], destCentroSur];
    const pathArtery = [originJuriquilla, [20.6150, -100.4050], destCentroSur];

    const l1 = L.polyline(pathBQ, {color: '#0066ff', weight: 4, opacity: 0.85}).addTo(map);
    const l2 = L.polyline(pathLibramiento, {color: '#00cc99', weight: 4, opacity: 0.85}).addTo(map);
    const l3 = L.polyline(pathArtery, {color: '#94a3b8', weight: 2, opacity: 0.6}).addTo(map);

    activeNetworkLayers.push(l1, l2, l3);
}