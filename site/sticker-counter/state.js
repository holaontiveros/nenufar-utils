import {convertUnits, unitToMillimeters} from '../shared/units.js';

export function createStickerState() {
  return {
    unit: 'mm',
    vinylWidth: '480',
    widthValue: '',
    shape: 'circle',
    stickerSize: '50',
    sizeValue: '',
    rectangleWidth: '50',
    rectangleHeight: '30',
    gap: '4',
    gapValue: '',
    length: '1000',
    lengthValue: '',
    viewMode: 'overview',
    png: null,
  };
}

export function selectedMillimeters(selection, manualValue, unit) {
  return selection === 'manual' ? unitToMillimeters(Number(manualValue), unit) : Number(selection);
}

export function convertManualMeasurements(state, nextUnit) {
  for (const key of ['widthValue', 'sizeValue', 'rectangleWidth', 'rectangleHeight', 'gapValue', 'lengthValue']) {
    if (state[key] != null && state[key] !== '') state[key] = String(Number(convertUnits(Number(state[key]), state.unit, nextUnit).toFixed(3)));
  }
  state.unit = nextUnit;
}

export function stickerDimensions(state) {
  if (state.shape === 'rectangle') {
    return {
      width: unitToMillimeters(Number(state.rectangleWidth), state.unit),
      height: unitToMillimeters(Number(state.rectangleHeight), state.unit),
    };
  }
  const size = selectedMillimeters(state.stickerSize, state.sizeValue, state.unit);
  if (state.shape === 'png' && state.png) {
    const longestSide = Math.max(state.png.width, state.png.height);
    return {width: size * state.png.width / longestSide, height: size * state.png.height / longestSide};
  }
  return {width: size, height: size};
}
