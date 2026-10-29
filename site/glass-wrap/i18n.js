import {resolveLocale} from '../shared/locale.js';

export {resolveLocale};

const translations = {
  en: {
    generatorLabel: 'Glass wrap generator',
    measureUsing: 'Measure using',
    perimeter: 'Perimeter',
    diameter: 'Diameter',
    perimeterHelp: 'Wrap a flexible measuring tape around the outside of the glass at the top and bottom. Enter each full distance around.',
    diameterHelp: 'Measure straight across the outside of the glass through the center, at the top and bottom.',
    topPerimeter: 'Top perimeter',
    bottomPerimeter: 'Bottom perimeter',
    topPerimeterError: 'Top perimeter must be a number greater than 0 {unit}.',
    bottomPerimeterError: 'Bottom perimeter must be a number greater than 0 {unit}.',
    matchingPerimeters: 'Matching perimeters create a straight wrap.',
    conicalPerimeterNote: 'Different perimeters: this template follows the glass taper.',
    measurementExample: 'e.g. {value}',
    pageTitle: 'Glass Wrap', pageDescription: 'Create print-accurate SVG wrap templates for straight and conical glasses.', language: 'Language', apps: 'Apps', shop: 'Shop', primaryNavigation: 'Primary navigation', units: 'Units', eyebrow: 'SVG TEMPLATE TOOL', heading: 'Glass Wrap', intro: 'Enter the outside dimensions of your glass. Download a cut outline that prints at actual size.', measurements: 'MEASUREMENTS', measurementsNote: 'Choose millimeters or centimeters for your measurements.', topDiameter: 'Top diameter', bottomDiameter: 'Bottom diameter', height: 'Glass height', example80: 'e.g. 80', example70: 'e.g. 70', example120: 'e.g. 120', topDiameterError: 'Top diameter must be a number greater than 0 {unit}.', bottomDiameterError: 'Bottom diameter must be a number greater than 0 {unit}.', heightError: 'Glass height must be a number greater than 0 {unit}.', matchingDiameters: 'Matching diameters create a straight wrap.', straightNote: 'Matching diameters: this template is a rectangle.', conicalNote: 'Different diameters: this template follows the glass taper.', addGlueTab: 'Add 10 mm glue tab', glueTabNote: 'Use for wraps that will be glued rather than printed on sticker paper.', fillTemplate: 'Fill template with Nenúfar pink', fillTemplateNote: 'Off keeps the preview and SVG as a contour only.', downloadSvg: 'Download SVG', downloadPng: 'Download PNG', preparingPng: 'Preparing PNG…', livePreview: 'LIVE PREVIEW', cutOutline: 'Your cut outline', waiting: 'Waiting for dimensions', waitingNote: 'Enter all three measurements to see the template.', straightGlass: 'Straight glass', conicalGlass: 'Conical glass', previewNote: 'The outline is shown to fit this panel. The downloaded SVG retains its real millimeter dimensions.',
  },
  es: {
    generatorLabel: 'Generador de plantillas para vasos',
    measureUsing: 'Medir usando',
    perimeter: 'Perímetro',
    diameter: 'Diámetro',
    perimeterHelp: 'Rodea el vaso por fuera con una cinta métrica flexible en la parte superior e inferior. Ingresa la medida de cada vuelta completa.',
    diameterHelp: 'Mide de un borde exterior al otro pasando por el centro del vaso, en la parte superior e inferior.',
    topPerimeter: 'Perímetro superior',
    bottomPerimeter: 'Perímetro inferior',
    topPerimeterError: 'El perímetro superior debe ser un número mayor que 0 {unit}.',
    bottomPerimeterError: 'El perímetro inferior debe ser un número mayor que 0 {unit}.',
    matchingPerimeters: 'Los perímetros iguales crean un forro recto.',
    conicalPerimeterNote: 'Perímetros distintos: esta plantilla sigue la forma cónica del vaso.',
    measurementExample: 'ej. {value}',
    pageTitle: 'Plantilla para vasos', pageDescription: 'Crea plantillas SVG a escala real para vasos rectos y cónicos.', language: 'Idioma', apps: 'Apps', shop: 'Tienda', primaryNavigation: 'Navegación principal', units: 'Unidades', eyebrow: 'HERRAMIENTA DE PLANTILLAS SVG', heading: 'Plantilla para vasos', intro: 'Ingresa las medidas exteriores de tu vaso. Descarga un contorno de corte a escala real.', measurements: 'MEDIDAS', measurementsNote: 'Elige milímetros o centímetros para las medidas.', topDiameter: 'Diámetro superior', bottomDiameter: 'Diámetro inferior', height: 'Altura del vaso', example80: 'ej. 80', example70: 'ej. 70', example120: 'ej. 120', topDiameterError: 'El diámetro superior debe ser un número mayor que 0 {unit}.', bottomDiameterError: 'El diámetro inferior debe ser un número mayor que 0 {unit}.', heightError: 'La altura del vaso debe ser un número mayor que 0 {unit}.', matchingDiameters: 'Los diámetros iguales crean un forro recto.', straightNote: 'Diámetros iguales: esta plantilla es un rectángulo.', conicalNote: 'Diámetros distintos: esta plantilla sigue la forma cónica del vaso.', addGlueTab: 'Agregar pestaña de pegado de 10 mm', glueTabNote: 'Úsala cuando el forro se pegue en lugar de imprimirse en papel adherible.', fillTemplate: 'Rellenar plantilla con rosa Nenúfar', fillTemplateNote: 'Desactivado mantiene el contorno en la vista previa y el SVG.', downloadSvg: 'Descargar SVG', downloadPng: 'Descargar PNG', preparingPng: 'Preparando PNG…', livePreview: 'VISTA PREVIA', cutOutline: 'Tu contorno de corte', waiting: 'Esperando medidas', waitingNote: 'Ingresa las tres medidas para ver la plantilla.', straightGlass: 'Vaso recto', conicalGlass: 'Vaso cónico', previewNote: 'El contorno se adapta a este panel. El SVG descargado conserva sus dimensiones reales en milímetros.',
  },
};

export function translate(locale, key) {
  return translations[resolveLocale(locale)]?.[key] ?? translations.en[key] ?? key;
}
