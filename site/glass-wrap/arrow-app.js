import {html, mountArrow, reactive} from '../shared/arrow-runtime.js';
import {buildTemplate, createSvgMarkup, validateMeasurements} from './geometry.js';
import {createPngBlob} from './export.js';
import {resolveLocale, translate} from './i18n.js';
import {getPreferredLocale, getSessionStorage, savePreferredLocale} from '../shared/locale.js';
import {convertUnits, unitToMillimeters} from './units.js';

const storage = getSessionStorage(window);
const state = reactive({
  locale: getPreferredLocale(navigator.language, storage),
  unit: 'mm',
  values: {topDiameter: '', bottomDiameter: '', height: ''},
  touched: {topDiameter: false, bottomDiameter: false, height: false},
  glueTab: false,
  filled: false,
  preparingPng: false,
});

const text = (key) => translate(state.locale, key);
const measurements = () => Object.fromEntries(Object.entries(state.values).map(([key, value]) => [key, unitToMillimeters(Number(value), state.unit)]));
const validation = () => validateMeasurements(measurements());
const template = () => validation().valid ? buildTemplate(measurements(), {includeGlueTab: state.glueTab}) : null;
const error = (key) => state.touched[key] && validation().errors[key] ? text(`${key}Error`).replace('{unit}', state.unit) : '';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadSvg() {
  const current = template();
  if (!current) return;
  downloadBlob(new Blob([createSvgMarkup(current, {filled: state.filled})], {type: 'image/svg+xml'}), `glass-wrap-${current.kind}${current.tabWidth ? '-with-tab' : ''}.svg`);
}

async function downloadPng() {
  const current = template();
  if (!current) return;
  state.preparingPng = true;
  try {
    downloadBlob(await createPngBlob(current, {filled: state.filled}), `glass-wrap-${current.kind}${current.tabWidth ? '-with-tab' : ''}.png`);
  } finally {
    state.preparingPng = false;
  }
}

function changeUnit(event) {
  const nextUnit = event.target.value;
  for (const key of Object.keys(state.values)) {
    if (state.values[key] !== '') state.values[key] = String(convertUnits(Number(state.values[key]), state.unit, nextUnit));
    // Only unit changes rewrite the native input. Reactive value bindings
    // discard unfinished decimals (such as `8.`) and move the caret.
    event.target.form.elements.namedItem(key).value = state.values[key];
  }
  state.unit = nextUnit;
}

function inputMeasurement(event) {
  const key = event.target.name;
  if (!Object.hasOwn(state.values, key)) return;
  state.values[key] = event.target.value;
  state.touched[key] = true;
}

const page = html`
  <main class="app-shell">
    <section class="intro" aria-labelledby="page-title">
      <p class="eyebrow">${() => text('eyebrow')}</p>
      <h1 id="page-title">${() => text('heading')}</h1>
      <p>${() => text('intro')}</p>
    </section>
    <section class="workspace" aria-label="Glass wrap generator">
      <form id="measurements-form" class="controls" novalidate @input="${inputMeasurement}">
        <div class="section-heading"><p class="eyebrow">${() => text('measurements')}</p><p>${() => text('measurementsNote')}</p>
          <label class="unit-control" for="unit"><span>${() => text('units')}</span><select id="unit" value="${() => state.unit}" @change="${changeUnit}"><option value="mm">mm</option><option value="cm">cm</option></select></label>
        </div>
        <label for="top-diameter"><span>${() => `${text('topDiameter')} (${state.unit})`}</span><input id="top-diameter" name="topDiameter" type="number" min="0.01" step="any" inputmode="decimal" required placeholder="${() => text('example80')}" aria-invalid="${() => String(Boolean(error('topDiameter')))}"/><small id="top-diameter-error" class="field-error">${() => error('topDiameter')}</small></label>
        <label for="bottom-diameter"><span>${() => `${text('bottomDiameter')} (${state.unit})`}</span><input id="bottom-diameter" name="bottomDiameter" type="number" min="0.01" step="any" inputmode="decimal" required placeholder="${() => text('example70')}" aria-invalid="${() => String(Boolean(error('bottomDiameter')))}"/><small id="bottom-diameter-error" class="field-error">${() => error('bottomDiameter')}</small></label>
        <label for="glass-height"><span>${() => `${text('height')} (${state.unit})`}</span><input id="glass-height" name="height" type="number" min="0.01" step="any" inputmode="decimal" required placeholder="${() => text('example120')}" aria-invalid="${() => String(Boolean(error('height')))}"/><small id="glass-height-error" class="field-error">${() => error('height')}</small></label>
        <p id="shape-note" class="shape-note">${() => { const current = template(); return !current || current.kind === 'straight' ? text('matchingDiameters') : text('conicalNote'); }}</p>
        <label class="tab-option" for="glue-tab"><input id="glue-tab" type="checkbox" checked="${() => state.glueTab}" @change="${(event) => { state.glueTab = event.target.checked; }}"/><span><strong>${() => text('addGlueTab')}</strong><small>${() => text('glueTabNote')}</small></span></label>
        <label class="tab-option" for="filled-template"><input id="filled-template" type="checkbox" checked="${() => state.filled}" @change="${(event) => { state.filled = event.target.checked; }}"/><span><strong>${() => text('fillTemplate')}</strong><small>${() => text('fillTemplateNote')}</small></span></label>
        <div class="download-actions"><button id="download" type="button" disabled="${() => !template()}" @click="${downloadSvg}">${() => text('downloadSvg')}</button><button id="download-png" type="button" disabled="${() => !template() || state.preparingPng}" @click="${downloadPng}">${() => state.preparingPng ? text('preparingPng') : text('downloadPng')}</button></div>
      </form>
      <section class="preview-panel" aria-labelledby="preview-title"><div class="preview-heading"><div><p class="eyebrow">${() => text('livePreview')}</p><h2 id="preview-title">${() => text('cutOutline')}</h2></div><span id="shape-badge" class="shape-badge">${() => { const current = template(); return !current ? text('waiting') : current.kind === 'straight' ? text('straightGlass') : text('conicalGlass'); }}</span></div><div id="preview" class="preview" aria-live="polite"><p hidden="${() => Boolean(template())}">${() => text('waitingNote')}</p><svg hidden="${() => !template()}" xmlns="http://www.w3.org/2000/svg" width="${() => `${template()?.height ?? 0}mm`}" height="${() => `${template()?.width ?? 0}mm`}" viewBox="${() => { const current = template(); return `0 0 ${current?.height ?? 0} ${current?.width ?? 0}`; }}"><g transform="${() => `translate(0 ${template()?.width ?? 0}) rotate(-90)`}"><path d="${() => template()?.svgPath ?? ''}" fill="${() => state.filled ? '#f1749e' : 'none'}" stroke="${() => state.filled ? '#672c66' : '#000'}" stroke-width="0.25"/></g></svg></div><p class="preview-note">${() => text('previewNote')}</p></section>
    </section>
  </main>`;

function syncLanguage(event) {
  state.locale = resolveLocale(event.target.value);
  savePreferredLocale(state.locale, storage);
  document.documentElement.lang = state.locale;
  document.title = text('pageTitle');
  document.querySelector('#page-description').content = text('pageDescription');
}

const language = document.querySelector('#language');
language.value = state.locale;
language.addEventListener('change', syncLanguage);
syncLanguage({target: language});
mountArrow(page, document.querySelector('#glass-wrap-app'));
