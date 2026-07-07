(function () {
  const mapEl = document.getElementById('ecopetrol-map');
  if (!mapEl) return;

  const loading = mapEl.querySelector('.map-loading');
  const assets = {
    colombia: 'assets/geo/colombia_slim.geojson',
    departamentos: 'assets/geo/departamentos_slim.geojson',
    ecopetrol: 'assets/geo/ecopetrol_proyectos.geojson'
  };

  function setMapMessage(message) {
    if (loading) loading.textContent = message;
  }

  function getProjectStyle() {
    return {
      fillColor: '#FDD000',
      fillOpacity: 0.82,
      color: 'rgba(255,226,70,.9)',
      weight: 0.9,
      opacity: 0.95,
      smoothFactor: 0
    };
  }

  function getDepartmentStyle() {
    return {
      color: 'rgba(245,196,0,.035)',
      weight: 0.25,
      opacity: 0.22,
      fill: false,
      smoothFactor: 1.4
    };
  }

  function getCountryStyle() {
    return {
      color: 'rgba(245,196,0,.18)',
      weight: 1.4,
      opacity: 0.45,
      fill: false,
      dashArray: '5 4',
      smoothFactor: 0
    };
  }

  async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudo cargar ${url}`);
    return response.json();
  }

  async function init() {
    if (!window.L) {
      setMapMessage('No se pudo cargar Leaflet. Verifica la conexión para ver el geovisor.');
      return;
    }

    const embedded = window.GEOTEC_ECOPETROL_GEO;
    const [colombia, departamentos, ecopetrol] = embedded
      ? [embedded.colombia, embedded.departamentos, embedded.ecopetrol]
      : await Promise.all([
        loadJson(assets.colombia),
        loadJson(assets.departamentos),
        loadJson(assets.ecopetrol)
      ]);

    const map = L.map(mapEl, {
      center: [4.7, -73.2],
      zoom: 6,
      minZoom: 5,
      maxZoom: 19,
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: true
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      opacity: 0.82
    }).addTo(map);

    L.geoJSON(colombia, {
      style: getCountryStyle,
      interactive: false
    }).addTo(map);

    const showReferenceBoundaries = false;
    if (showReferenceBoundaries) {
      L.geoJSON(departamentos, {
        style: getDepartmentStyle,
        interactive: false
      }).addTo(map);
    }

    const projectLayer = L.geoJSON(ecopetrol, {
      style: getProjectStyle,
      onEachFeature(feature, layer) {
        const p = feature.properties || {};
        layer.bindPopup(
          `<div class="geo-popup-title">Ecopetrol S.A.</div>` +
          `<div class="geo-popup-row"><b>Departamento:</b> ${p.DEPARTAMEN || 'No registrado'}</div>` +
          `<div class="geo-popup-row"><b>Municipio:</b> ${p.MUNICIPIO || 'No registrado'}</div>` +
          `<div class="geo-popup-row"><b>Sector:</b> ${p.SECTOR || 'Hidrocarburos'}</div>`
        );
        layer.on('mouseover', () => layer.setStyle({
          fillOpacity: 0.78,
          color: '#FDD000',
          weight: 1.05
        }));
        layer.on('mouseout', () => projectLayer.resetStyle(layer));
        layer.on('click', () => {
          const layerBounds = layer.getBounds && layer.getBounds();
          if (layerBounds && layerBounds.isValid()) {
            map.fitBounds(layerBounds.pad(0.18), { maxZoom: 17 });
          }
        });
      }
    }).addTo(map);

    const bounds = projectLayer.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.03), { animate: false, maxZoom: 8.25 });

    if (loading) loading.remove();
    setTimeout(() => map.invalidateSize(), 200);
  }

  init().catch((error) => {
    console.error(error);
    setMapMessage('No se pudo cargar el geovisor Ecopetrol.');
  });
}());
