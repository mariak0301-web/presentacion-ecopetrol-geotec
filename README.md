# Presentación interactiva GEOTEC - Ecopetrol

Presentación web estática para la propuesta técnica de aseguramiento ambiental, enfocada en la trayectoria GEOTEC - Ecopetrol, herramientas InnoLab y geovisor de proyectos desarrollados conjuntamente.

## Estructura

- `index.html`: contenido principal de la presentación.
- `styles.css`: diseño visual, responsive y ajustes de marca.
- `script.js`: interacción general de la presentación.
- `scripts/`: datos y lógica del geovisor Ecopetrol.
- `assets/`: logos, fauna, fondos, clientes e insumos geográficos filtrados.
- `assets/apps/`: capturas de interfaz de los aplicativos GEOTEC (fuente: `PANTALLAZOS/`).
- `vendor/leaflet/`: dependencia local para el mapa interactivo.
- `Presentacion_Portable.html`: archivo generado localmente; no se versiona en GitHub.

## Uso local

Abrir `index.html` directamente en el navegador o servir la carpeta con un servidor estático:

```powershell
python -m http.server 8018
```

Luego abrir:

```text
http://localhost:8018/index.html
```

## Versión portable

`Presentacion_Portable.html` es un único archivo autocontenido —CSS, JS,
imágenes y GeoJSON embebidos— pensado para enviarse por correo o abrirse sin la
carpeta. **Se genera localmente; no se publica en GitHub.** Después de tocar
`index.html`, `styles.css` o `script.js`:

```powershell
python CODE/construir_portable_marco.py
```

El script reporta los recursos incrustados y falla de forma visible si queda
alguna referencia local sin resolver.

## Correspondencia con la propuesta

El contenido es trazable a
`PROPUESTA/PROPUESTA_TECNICA_FACTORES_1241_1244_V8_AUDITADA_TRAZABILIDAD_ALBA.docx`.
Cuando el documento cambie, esta presentación debe revisarse contra él: las
cifras, los nombres de proyecto y los compromisos de alcance no deben divergir.

## Nota de confidencialidad

La presentación omite nombres de proyectos y datos no relacionados con Ecopetrol. El repositorio debe mantenerse privado salvo autorización expresa.
