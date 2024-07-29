// Inicialización del mapa
var map = L.map('map').setView([31.8908, -115.9240], 8); // Ajusta las coordenadas y el nivel de zoom según sea necesario

// Añadir capa base del mapa
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Añadir capa base de Google Satélite
var googleSat = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'Map data &copy; <a href="https://www.google.com/intl/en/help/terms_maps.html">Google</a>'
});

// Añadir control de capas
var baseMaps = {
    "OpenStreetMap": osm,
    "Google Satélite": googleSat
};

L.control.layers(baseMaps).addTo(map);

// Definir el estilo normal para las capas
function style(feature) {
    return {
        color: getFillColor(feature.properties.rezago_soc),
        weight: 1,
        opacity: 1,
        fillColor: getFillColor(feature.properties.rezago_soc),
        fillOpacity: 0.6
    };
}

// Función para determinar el color de relleno basado en el rezago social
function getFillColor(rezago_soc) {
    const colors = {
        'Muy alto': '#730000',
        'Alto': '#E60000',
        'Medio': '#FFAA00',
        'Bajo': '#ABCD66',
        'Muy bajo': '#CDF57A'
    };
    return colors[rezago_soc] || '#545454';
}

// Función para formatear valores como porcentaje con un decimal
function formatPercentage(value) {
    if (value === undefined || value === null || value === '') return '-';
    let number = parseFloat(value);
    if (isNaN(number)) return '-';
    return number.toFixed(1) + '%';
}

// Definir el estilo cuando el mouse está sobre la capa
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 2,
        color: 'black',
        fillOpacity: 0.1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    updateSidebarContent(e.target.feature.properties);
}

// Actualizar el contenido del sidebar
function updateSidebarContent(properties) {
    var sidebarContent = '<div id="sidebar">';
    sidebarContent += '<img src="PNG/LOGO COPLADE BC.png" alt="Logo COPLADE BC" class="sidebar-logo">';
    sidebarContent += '<h3>' + (properties['localidad'] || '') + '</h3>';
    sidebarContent += '<table id="sidebar-table">';
    
    sidebarContent += '<tr class="centered"><td colspan="2"><strong>Clave Localidad</strong><br /><span>' + (properties['CVEGEO'] || '') + '</span></td></tr>';
    sidebarContent += '<tr><th scope="row">Población total</th><td>' + (properties['pob_tot'] || '') + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Total de viviendas</th><td>' + (properties['viviendas_'] || '') + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Analfabeta de 15 años y más</th><td>' + formatPercentage(properties['15m_analfa']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">6 a 14 años que no asiste a la escuela</th><td>' + formatPercentage(properties['6_14_escue']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">15 a 24 años que no asiste a la escuela</th><td>' + formatPercentage(properties['15_24_escu']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Sin educación básica de 15 años y más</th><td>' + formatPercentage(properties['15m_basica']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Sin derecho a salud</th><td>' + formatPercentage(properties['salud']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas con hacinamiento</th><td>' + formatPercentage(properties['hacinamien']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Sin servicio de agua entubada</th><td>' + formatPercentage(properties['agua_entub']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin sanitario</th><td>' + formatPercentage(properties['sanitario']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin drenaje</th><td>' + formatPercentage(properties['drenaje']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin electricidad</th><td>' + formatPercentage(properties['electricid']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas con piso de tierra</th><td>' + formatPercentage(properties['piso_tierr']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin lavadora</th><td>' + formatPercentage(properties['lavadora']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin refrigerador</th><td>' + formatPercentage(properties['refrigerad']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin teléfono fijo</th><td>' + formatPercentage(properties['telefono']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin teléfono celular</th><td>' + formatPercentage(properties['celular']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin PC, laptop o tablet</th><td>' + formatPercentage(properties['pc_laptop']) + '</td></tr>';
    sidebarContent += '<tr><th scope="row">Viviendas sin internet</th><td>' + formatPercentage(properties['internet']) + '</td></tr>';
    sidebarContent += '<tr class="centered"><td colspan="2"><strong>Rezago social</strong><br /><span>' + (properties['rezago_soc'] || '') + '</span></td></tr>';

    sidebarContent += '</table>';
    sidebarContent += '</div>';

    document.getElementById('sidebar').innerHTML = sidebarContent;
}

// Restaurar el estilo original de la capa y limpiar el contenido del sidebar
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
    resetSidebarContent();  // Restaurar el contenido del sidebar a su estado predeterminado
}

// Configuración para el hover del sidebar
function setupSidebarHover() {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        sidebar.addEventListener('mouseenter', function () {
            sidebar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
            sidebar.style.borderRight = '1px solid #333';
        });

        sidebar.addEventListener('mouseleave', function () {
            sidebar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
            sidebar.style.borderRight = '1px solid lightgray';
        });
    }
}

// Variable global para la capa GeoJSON
var geojsonLayer;

// Cargar el archivo GeoJSON
fetch('REZAGO COPLADE MAPA 2.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonLayer = L.geoJSON(data, {
            style: style,
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight
                });
            }
        }).addTo(map);

        // Configurar el hover del sidebar después de cargar el GeoJSON
        setupSidebarHover();
        
        // Configurar la búsqueda después de cargar el GeoJSON
        setupSearch(data);
    })
    .catch(error => console.error('Error al cargar el archivo GeoJSON:', error));

// Configuración de la búsqueda
function setupSearch(geojsonData) {
    const input = document.getElementById('search-input');
    let timeout;

    input.addEventListener('input', function () {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            const query = input.value.toLowerCase();
            
            if (query.trim() === '') {
                // Restaurar el mapa al estado original si no hay búsqueda
                resetSidebarContent();
                map.setView([31.8908, -115.9240], 8); // Ajusta las coordenadas y el nivel de zoom inicial
                return;
            }

            const features = geojsonData.features;
            const filtered = features.filter(feature => {
                const cvEgeoMatch = feature.properties.CVEGEO && feature.properties.CVEGEO.toLowerCase().includes(query);
                const localidadMatch = feature.properties.localidad && feature.properties.localidad.toLowerCase().includes(query);
                return cvEgeoMatch || localidadMatch;
            });

            if (filtered.length > 0) {
                const bounds = L.latLngBounds(filtered.map(feature => L.geoJSON(feature).getBounds()));
                map.fitBounds(bounds);
                updateSidebarContent(filtered[0].properties); // Actualiza con el primer resultado
            } else {
                resetSidebarContent();
                map.setView([31.8908, -115.9240], 8); // Ajusta las coordenadas y el nivel de zoom inicial
            }
        }, 300);
    });
}
