// Memoria local simulada para guardar los parámetros del carro
let userVehicleData = {
    type: "Sedán / Compacto",
    engine: "Combustión Interna",
    goal: "Máxima Eficiencia de Tiempo"
};

// CONTROL DE TIMING DE LA ANIMACIÓN + ENTRADA DE FORMULARIO DE REGISTRO
window.addEventListener('DOMContentLoaded', () => {
    const phaseApp = document.getElementById('splash-phase-app');
    const phaseGov = document.getElementById('splash-phase-gov');
    const splashScreen = document.getElementById('splash-screen');
    const onboarding = document.getElementById('onboarding-overlay');

    // Tiempo 1: App logo (2.2s)
    setTimeout(() => {
        phaseApp.classList.remove('active');
        
        // Tiempo 2: Gobierno logo (2.2s)
        setTimeout(() => {
            phaseGov.classList.add('active');
            
            // Tiempo 3: Cierra Splash Screen y despliega el Modal de Registro de Carro
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => { 
                    splashScreen.style.visibility = 'hidden'; 
                    // En lugar de pasar directo, activamos el onboarding interactivo
                    onboarding.classList.add('show');
                    map.invalidateSize(); 
                }, 600);
            }, 2200);

        }, 400); 
    }, 2200);

    triggerNNEngine(); 
});

// Guardar los datos del formulario y arrancar oficialmente el Dashboard
function saveVehicleProfile(event) {
    event.preventDefault(); // Detiene la recarga de página
    
    // Captura de datos ingresados por el usuario
    userVehicleData.type = document.getElementById('car-type').value;
    userVehicleData.engine = document.getElementById('engine-type').value;
    userVehicleData.goal = document.getElementById('opt-goal').value;

    // Actualiza el badge visual en la barra lateral para demostrar que los datos se guardaron
    const badge = document.getElementById('active-profile-badge');
    badge.innerHTML = `⚙️ Sincronización del Núcleo: ${userVehicleData.type} (${userVehicleData.engine})`;
    badge.style.display = "block";

    // Modifica dinámicamente el texto de la alerta neuronal para personalizarlo con sus datos
    document.getElementById('dynamic-notification-text').innerHTML = `
        Secuencia de hábitos detectada para tu <strong>${userVehicleData.type}</strong>. 
        Pronóstico de próxima salida [18:20]. La ruta estándar presenta retrasos. 
        Se ha calculado una optimización de desvío adaptada para <strong>${userVehicleData.goal}</strong>.
    `;

    // Cierra el modal con efecto fade-out
    document.getElementById('onboarding-overlay').classList.remove('show');
}

// Tab Switching Mechanism + Disparador de Alertas Predictivas Personalizadas
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // DISPARADOR: Si entra a Neural Network, lanza la alerta usando las variables guardadas
    if (tabId === 'nn-tab') {
        setTimeout(() => {
            document.getElementById('ai-notification').classList.add('show');
        }, 300);
    } else {
        document.getElementById('ai-notification').classList.remove('show');
    }
}

function closeNotification() {
    document.getElementById('ai-notification').classList.remove('show');
}

// Interactive Neural Network Sandbox Logic
function triggerNNEngine() {
    const selector = document.getElementById('time-selector').value;
    const outputBox = document.getElementById('nn-output');
    
    if (selector === 'weekday-rush') {
        outputBox.innerHTML = `<strong>Resultado:</strong> Rutina confirmada.<br>📍 Destino: <strong>Centro Sur (Lugar de trabajo)</strong>.<br>🔮 Recomendación: Prioridad del algoritmo central sincronizada con <em>${userVehicleData.goal}</em>. Ruta B activa.`;
        outputBox.style.borderLeftColor = "var(--qro-blue)";
    } else if (selector === 'weekend-morning') {
        outputBox.innerHTML = "<strong>Resultado:</strong> Anomalía detectada (Viaje fuera de la rutina).<br>📍 Destino: <strong>Antea / Centro Comercial Juriquilla</strong>.<br>🔮 Recomendación: Enrutamiento abierto activo. Alta capacidad de red disponible.";
        outputBox.style.borderLeftColor = "var(--qro-green)";
    } else if (selector === 'night-shift') {
        outputBox.innerHTML = "<strong>Resultado:</strong> Nodo alternativo del clúster encontrado.<br>📍 Destino: <strong>Zona Logística de Pénjamo</strong>.<br>🔮 Recomendación: Protocolos de optimización para carreteras de larga distancia activados.";
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

L.circleMarker(originJuriquilla, {radius: 8, color: '#0066ff', fillColor: '#0066ff', fillOpacity: 0.9}).addTo(map).bindPopup('<b>Nodo de origen:</b> Juriquilla');
L.circleMarker(destCentroSur, {radius: 8, color: '#00cc99', fillColor: '#00cc99', fillOpacity: 0.9}).addTo(map).bindPopup('<b>Nodo de destino:</b> Centro Sur');

let activeNetworkLayers = [];

function clearNetwork() {
    activeNetworkLayers.forEach(layer => map.removeLayer(layer));
    activeNetworkLayers = [];
}

function runIndividualRouting() {
    clearNetwork();
    document.getElementById('token-count').innerText = "0.00 QRO";
    document.getElementById('system-status').innerText = "SATURACIÓN CRÍTICA";
    document.getElementById('system-status').style.backgroundColor = "#fee2e2";
    document.getElementById('system-status').style.color = "#ef4444";
    document.getElementById('status-desc').innerHTML = "<strong>Resultado:</strong> Las aplicaciones de navegación estándar enviaron al 100% de los vehículos por la misma ruta. Congestionamiento masivo. Velocidad promedio: 11 km/h.";

    const heavyCongestionPath = [originJuriquilla, [20.6550, -100.4250], [20.6150, -100.4050], [20.5850, -100.3800], destCentroSur];
    const polyline = L.polyline(heavyCongestionPath, {color: '#ef4444', weight: 6, opacity: 0.85, dashArray: '8, 8'}).addTo(map);
    activeNetworkLayers.push(polyline);
}

function runCollaborativeRouting() {
    clearNetwork();
    document.getElementById('token-count').innerText = "+25.50 QRO";
    document.getElementById('system-status').innerText = "EQUILIBRADO Y EFICIENTE";
    document.getElementById('system-status').style.backgroundColor = "#d1fae5";
    document.getElementById('system-status').style.color = "#065f46";
    document.getElementById('status-desc').innerHTML = `<strong>Resultado:</strong> La IA optimizó de forma descentralizada la distribución del tráfico para <strong>${userVehicleData.type}</strong>. El flujo se equilibró exitosamente entre nodos arteriales alternativos.`;

    const pathBQ = [originJuriquilla, [20.6650, -100.4000], [20.6100, -100.3700], [20.5800, -100.3600], destCentroSur];
    const pathLibramiento = [originJuriquilla, [20.6600, -100.4700], [20.5900, -100.4600], [20.5500, -100.4100], destCentroSur];
    const pathArtery = [originJuriquilla, [20.6150, -100.4050], destCentroSur];

    const l1 = L.polyline(pathBQ, {color: '#0066ff', weight: 4, opacity: 0.85}).addTo(map);
    const l2 = L.polyline(pathLibramiento, {color: '#00cc99', weight: 4, opacity: 0.85}).addTo(map);
    const l3 = L.polyline(pathArtery, {color: '#94a3b8', weight: 2, opacity: 0.6}).addTo(map);

    activeNetworkLayers.push(l1, l2, l3);
}