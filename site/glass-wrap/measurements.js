import {unitToMillimeters} from '../shared/units.js';

/** @typedef {'diameter' | 'perimeter'} MeasurementMode */

/**
 * Convert either edge measurement without rounding before geometry calculation.
 * @param {number} value
 * @param {MeasurementMode} from
 * @param {MeasurementMode} to
 */
export function convertMeasurementMode(value, from, to) {
  if (from === to) return value;
  return from === 'perimeter' ? value / Math.PI : value * Math.PI;
}

/**
 * Retain the domain's diameter keys; only the two edge inputs change meaning.
 * @param {{topDiameter: string | number, bottomDiameter: string | number, height: string | number}} values
 * @param {'mm' | 'cm'} unit
 * @param {MeasurementMode} mode
 */
export function normalizeMeasurements(values, unit, mode) {
  return {
    topDiameter: convertMeasurementMode(unitToMillimeters(Number(values.topDiameter), unit), mode, 'diameter'),
    bottomDiameter: convertMeasurementMode(unitToMillimeters(Number(values.bottomDiameter), unit), mode, 'diameter'),
    height: unitToMillimeters(Number(values.height), unit),
  };
}
