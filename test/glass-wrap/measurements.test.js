import assert from 'node:assert/strict';
import test from 'node:test';
import {convertMeasurementMode, normalizeMeasurements} from '../../site/glass-wrap/measurements.js';
import {buildTemplate, createSvgMarkup, validateMeasurements} from '../../site/glass-wrap/geometry.js';

test('perimeter input produces a straight wrap whose body width matches the tape measurement', () => {
  const measurements = normalizeMeasurements({topDiameter: '250', bottomDiameter: '250', height: '120'}, 'mm', 'perimeter');
  const template = buildTemplate(measurements);
  assert.equal(template.kind, 'straight');
  assert.ok(Math.abs(template.bodyWidth - 250) < 1e-10);
  assert.equal(template.bodyHeight, 120);
});

for (const includeGlueTab of [false, true]) {
  for (const bottom of [80, 70, 90, 80.00001]) {
    test(`perimeter and diameter produce identical SVGs (bottom ${bottom}, tab ${includeGlueTab})`, () => {
      const diameter = normalizeMeasurements({topDiameter: 80, bottomDiameter: bottom, height: 120}, 'mm', 'diameter');
      const perimeter = normalizeMeasurements({topDiameter: Math.PI * 8, bottomDiameter: Math.PI * bottom / 10, height: 12}, 'cm', 'perimeter');
      const options = {includeGlueTab};
      assert.equal(createSvgMarkup(buildTemplate(perimeter, options)), createSvgMarkup(buildTemplate(diameter, options)));
      if (bottom === 70 || bottom === 90) {
        const template = buildTemplate(perimeter, options);
        assert.ok(Math.abs(template.outerRadius * template.angle - Math.PI * Math.max(80, bottom)) < 1e-10);
        assert.ok(Math.abs(template.innerRadius * template.angle - Math.PI * Math.min(80, bottom)) < 1e-10);
      }
    });
  }
}

test('switching modes converts measurements without rounding their physical size', () => {
  assert.equal(convertMeasurementMode(80, 'diameter', 'perimeter'), 80 * Math.PI);
  assert.equal(convertMeasurementMode(250, 'perimeter', 'diameter'), 250 / Math.PI);
  assert.equal(convertMeasurementMode(250, 'perimeter', 'perimeter'), 250);
  const diameter = convertMeasurementMode(250, 'perimeter', 'diameter');
  assert.ok(Math.abs(convertMeasurementMode(diameter, 'diameter', 'perimeter') - 250) < 1e-10);
});

for (const mode of ['diameter', 'perimeter']) {
  test(`${mode} normalization keeps invalid measurements invalid`, () => {
    for (const value of ['', undefined, NaN, Infinity, -Infinity, 0, -2, 'invalid']) {
      for (const key of ['topDiameter', 'bottomDiameter', 'height']) {
        const measurements = normalizeMeasurements({topDiameter: 250, bottomDiameter: 220, height: 120, [key]: value}, 'mm', mode);
        assert.ok(validateMeasurements(measurements).errors[key], `${key}: ${value}`);
      }
    }
  });
}
