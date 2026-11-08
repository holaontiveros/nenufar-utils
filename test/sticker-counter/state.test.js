import assert from 'node:assert/strict';
import test from 'node:test';
import {createStickerState, convertManualMeasurements, selectedMillimeters, stickerDimensions} from '../../site/sticker-counter/state.js';

import {calculateGrid} from '../../site/sticker-counter/layout.js';

test('normalizes manual Sticker Counter values and preserves them through unit changes', () => {
  const state = {unit: 'mm', widthValue: '300', sizeValue: '50', gapValue: '4', lengthValue: '1000'};
  assert.equal(selectedMillimeters('manual', state.widthValue, state.unit), 300);
  convertManualMeasurements(state, 'cm');
  assert.deepEqual(state, {unit: 'cm', widthValue: '30', sizeValue: '5', gapValue: '0.4', lengthValue: '100'});
  assert.equal(selectedMillimeters('manual', state.widthValue, state.unit), 300);
});

test('converts both custom rectangle dimensions without changing their physical size', () => {
  const state = {...createStickerState(), shape: 'rectangle', rectangleWidth: '80', rectangleHeight: '30'};
  convertManualMeasurements(state, 'cm');
  assert.equal(state.rectangleWidth, '8');
  assert.equal(state.rectangleHeight, '3');
  assert.deepEqual(stickerDimensions(state), {width: 80, height: 30});
  convertManualMeasurements(state, 'mm');
  assert.equal(state.rectangleWidth, '80');
  assert.equal(state.rectangleHeight, '30');
});

test('uses independent rectangle dimensions and rejects incomplete or invalid dimensions', () => {
  const state = {...createStickerState(), shape: 'rectangle', rectangleWidth: '80', rectangleHeight: '30'};
  assert.deepEqual(stickerDimensions(state), {width: 80, height: 30});
  for (const value of ['', '0', '-1', 'Infinity', 'invalid']) {
    const dimensions = stickerDimensions({...state, rectangleHeight: value});
    assert.equal(calculateGrid({itemWidth: dimensions.width, itemHeight: dimensions.height, gap: 4, length: 1000}).total, 0);
  }
});
