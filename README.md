# Presentación interactiva GEOTEC - Ecopetrol

Presentación web estática para la propuesta técnica de aseguramiento ambiental, enfocada en la trayectoria GEOTEC - Ecopetrol, herramientas InnoLab y geovisor de proyectos desarrollados conjuntamente.

## Estructura

- `index.html`: contenido principal de la presentación.
- `styles.css`: diseño visual, responsive y ajustes de marca.
- `script.js`: interacción general de la presentación.
- `scripts/`: datos y lógica del geovisor Ecopetrol.
- `assets/`: logos, fauna, fondos, clientes e insumos geográficos filtrados.
- `vendor/leaflet/`: dependencia local para el mapa interactivo.

## Uso local

Abrir `index.html` directamente en el navegador o servir la carpeta con un servidor estático:

```powershell
python -m http.server 8018
```

Luego abrir:

```text
http://localhost:8018/index.html
```

## Nota de confidencialidad

La presentación omite nombres de proyectos y datos no relacionados con Ecopetrol. El repositorio debe mantenerse privado salvo autorización expresa.
