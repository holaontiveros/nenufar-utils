import {resolveLocale} from '../shared/locale.js';

export {resolveLocale};

const translations = {
  en: {
    pageTitle: 'Sticker Counter', pageDescription: 'Visualize and count identical stickers on vinyl rolls.', language: 'Language', apps: 'Apps', shop: 'Shop', primaryNavigation: 'Primary navigation', eyebrow: 'VINYL LAYOUT CALCULATOR', heading: 'Sticker Counter', intro: 'See exactly how many identical stickers fit on your vinyl roll.', setup: 'SETUP', vinylWidth: 'Vinyl width (mm)', nenufarWidth: '480 mm (Nenúfar standard)', shape: 'Sticker type', circle: 'Circle', square: 'Square', rectangle: 'Rectangle', stickerWidth: 'Sticker width', stickerHeight: 'Sticker height', png: 'PNG image', uploadPng: 'Upload PNG', stickerSize: 'Sticker size', manual: 'Manual', sizeCm: 'Size (cm)', restoreOriginal: 'Restore original PNG size', originalSize: 'Original size: {width} × {height} cm', gap: 'Gap (mm)', length: 'Print length', lengthM: 'Length (m)', overview: 'Overview', inspection: 'Inspect sticker', overviewNote: 'The full vinyl sheet is shown at scale.', cappedOverview: 'Overview shows the first 2 m of this custom length.', count: 'STICKERS THAT FIT', across: 'Across', rows: 'Rows', total: 'Total', usedSpace: 'Used area: {width} mm × {length} mm', noFit: 'This sticker does not fit on the selected vinyl area.', uploadNote: 'PNG transparent padding is included in its size.', choosePng: 'Upload a PNG to preview it in the grid.', quickSize: '{size} cm', quickLength: '{length} m', invalidValue: 'Enter a value greater than zero.', zoomNote: 'A larger view of one sticker cell.', orderingHelp: 'Use this tool to estimate how many identical stickers fit before ordering them from us.', orderStickers: 'Order printed stickers',
  },
  es: {
    pageTitle: 'Contador de stickers', pageDescription: 'Visualiza y cuenta stickers idénticos en rollos de vinil.', language: 'Idioma', apps: 'Apps', shop: 'Tienda', primaryNavigation: 'Navegación principal', eyebrow: 'CALCULADORA DE VINIL', heading: 'Contador de stickers', intro: 'Ve exactamente cuántos stickers idénticos caben en tu rollo de vinil.', setup: 'CONFIGURACIÓN', vinylWidth: 'Ancho del vinil (mm)', nenufarWidth: '480 mm (estándar Nenúfar)', shape: 'Tipo de sticker', circle: 'Círculo', square: 'Cuadrado', rectangle: 'Rectángulo', stickerWidth: 'Ancho del sticker', stickerHeight: 'Alto del sticker', png: 'Imagen PNG', uploadPng: 'Subir PNG', stickerSize: 'Tamaño del sticker', manual: 'Manual', sizeCm: 'Tamaño (cm)', restoreOriginal: 'Restaurar tamaño original del PNG', originalSize: 'Tamaño original: {width} × {height} cm', gap: 'Separación (mm)', length: 'Largo de impresión', lengthM: 'Largo (m)', overview: 'Vista general', inspection: 'Inspeccionar sticker', overviewNote: 'Se muestra toda la lámina de vinil a escala.', cappedOverview: 'La vista general muestra los primeros 2 m de este largo personalizado.', count: 'STICKERS QUE CABEN', across: 'Por fila', rows: 'Filas', total: 'Total', usedSpace: 'Área usada: {width} mm × {length} mm', noFit: 'Este sticker no cabe en el área de vinil seleccionada.', uploadNote: 'El tamaño del PNG incluye el espacio transparente.', choosePng: 'Sube un PNG para verlo en la cuadrícula.', quickSize: '{size} cm', quickLength: '{length} m', invalidValue: 'Ingresa un valor mayor que cero.', zoomNote: 'Una vista más grande de una celda de sticker.', orderingHelp: 'Usa esta herramienta para calcular cuántos stickers idénticos caben antes de pedirlos con nosotros.', orderStickers: 'Pedir stickers impresos',
  },
};

const unitTranslations = {
  en: {units: 'Units', vinylWidth: 'Vinyl width', gap: 'Gap', nenufarWidth: '{value} {unit} (Nenúfar standard)', originalSize: 'Original size: {width} × {height} {unit}', usedSpace: 'Used area: {width} × {length} {unit}', cappedOverview: 'Overview shows the first {length} {unit} of this custom length.'},
  es: {units: 'Unidades', vinylWidth: 'Ancho del vinil', gap: 'Separación', nenufarWidth: '{value} {unit} (estándar Nenúfar)', originalSize: 'Tamaño original: {width} × {height} {unit}', usedSpace: 'Área usada: {width} × {length} {unit}', cappedOverview: 'La vista general muestra los primeros {length} {unit} de este largo personalizado.'},
};

export function translate(locale, key, values = {}) {
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replace(`{${name}}`, value),
    {...translations[resolveLocale(locale)], ...unitTranslations[resolveLocale(locale)]}[key] ?? translations.en[key] ?? key,
  );
}
