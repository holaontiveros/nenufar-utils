import {expect, test} from '@playwright/test';
import {readFile} from 'node:fs/promises';

async function enterMeasurements(page, {top = '80', bottom = '70', height = '120'} = {}) {
  await page.locator('#measurement-mode').selectOption('diameter');
  await page.locator('#top-diameter').fill(top);
  await page.locator('#bottom-diameter').fill(bottom);
  await page.locator('#glass-height').fill(height);
}

for (const locale of ['en', 'es']) {
  test(`Glass Wrap defaults to perimeter and preserves the wrap when switching modes in ${locale}`, async ({page}) => {
    await page.goto('/glass-wrap/');
    await page.locator('#language').selectOption(locale);
    await expect(page.locator('#measurement-mode')).toHaveValue('perimeter');
    await expect(page.locator('label[for="top-diameter"]')).toContainText(locale === 'en' ? 'Top perimeter (mm)' : 'Perímetro superior (mm)');
    await page.locator('#top-diameter').fill('250');
    await page.locator('#bottom-diameter').fill('250');
    await page.locator('#glass-height').fill('120');
    await expect(page.locator('#preview svg')).toHaveAttribute('height', '258mm');

    for (const bottom of ['250', '220']) {
      await page.locator('#bottom-diameter').fill(bottom);
      for (const tab of [false, true]) {
        await page.locator('#glue-tab').setChecked(tab);
        const outline = await page.locator('#preview path').getAttribute('d');
        await page.locator('#measurement-mode').selectOption('diameter');
        expect(Number(await page.locator('#top-diameter').inputValue())).toBeCloseTo(250 / Math.PI, 10);
        await expect(page.locator('#glass-height')).toHaveValue('120');
        await expect(page.locator('#preview path')).toHaveAttribute('d', outline);
        await expect(page.locator('label[for="top-diameter"]')).toContainText(locale === 'en' ? 'Top diameter (mm)' : 'Diámetro superior (mm)');
        await page.locator('#unit').selectOption('cm');
        await page.locator('#measurement-mode').selectOption('perimeter');
        expect(Number(await page.locator('#top-diameter').inputValue())).toBeCloseTo(25, 10);
        await expect(page.locator('#glass-height')).toHaveValue('12');
        await expect(page.locator('#preview path')).toHaveAttribute('d', outline);
        await expect(page.locator('#top-diameter')).toHaveAttribute('placeholder', locale === 'en' ? 'e.g. 25' : 'ej. 25');
        await page.locator('#unit').selectOption('mm');
        await expect(page.locator('#top-diameter')).toHaveValue('250');
        await expect(page.locator('#bottom-diameter')).toHaveValue(bottom);
      }
    }

    await page.locator('#filled-template').check();
    const outline = await page.locator('#preview path').getAttribute('d');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#download').click();
    const svg = await readFile(await (await downloadPromise).path(), 'utf8');
    expect(svg).toContain(`d="${outline}"`);
    expect(svg).toContain('fill="#f1749e"');
    const pngPromise = page.waitForEvent('download');
    await page.locator('#download-png').click();
    expect((await readFile(await (await pngPromise).path())).subarray(1, 4).toString()).toBe('PNG');
  });

  test(`Glass Wrap validates perimeter inputs and keeps empty fields empty on mode changes in ${locale}`, async ({page}) => {
    await page.goto('/glass-wrap/');
    await page.locator('#language').selectOption(locale);
    await page.locator('#measurement-mode').selectOption('diameter');
    await page.locator('#measurement-mode').selectOption('perimeter');
    await expect(page.locator('#top-diameter')).toHaveValue('');
    await expect(page.locator('#bottom-diameter')).toHaveValue('');
    await expect(page.locator('#download')).toBeDisabled();
    await page.locator('#unit').selectOption('cm');
    for (const value of ['0', '-1', '']) {
      await page.locator('#top-diameter').fill(value);
      await expect(page.locator('#top-diameter')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#top-diameter-error')).toHaveText(locale === 'en' ? 'Top perimeter must be a number greater than 0 cm.' : 'El perímetro superior debe ser un número mayor que 0 cm.');
      await expect(page.locator('#download')).toBeDisabled();
      await expect(page.locator('#download-png')).toBeDisabled();
    }
    await page.locator('#measurement-mode').selectOption('diameter');
    await expect(page.locator('#top-diameter-error')).toContainText(locale === 'en' ? 'Top diameter' : 'El diámetro superior');
  });
}

for (const locale of ['en', 'es']) {
  for (const unit of ['mm', 'cm']) {
    test(`Glass Wrap preserves decimal typing and cursor position in ${locale}/${unit}`, async ({page}) => {
      await page.goto('/glass-wrap/');
      await page.locator('#language').selectOption(locale);
      await page.locator('#unit').selectOption(unit);

      for (const id of ['top-diameter', 'bottom-diameter', 'glass-height']) {
        const input = page.locator(`#${id}`);
        // Separate key events let reactive updates run between keystrokes.
        await input.press('8');
        await input.press('.');
        await input.press('5');
        await expect(input).toHaveValue('8.5');

        await input.press('ArrowLeft');
        await input.press('2');
        await expect(input).toHaveValue('8.25');

        await input.fill('');
        await input.press('.');
        await input.press('5');
        await expect(input).toHaveValue('.5');
      }

      await expect(page.locator('#download')).toBeEnabled();
      const outline = await page.locator('#preview path').getAttribute('d');
      await page.locator('#unit').selectOption(unit === 'cm' ? 'mm' : 'cm');
      await expect(page.locator('#top-diameter')).toHaveValue(unit === 'cm' ? '5' : '0.05');
      await expect(page.locator('#preview path')).toHaveAttribute('d', outline);
    });
  }
}

test('Glass Wrap enables both exports for valid dimensions and preserves their physical size on unit change', async ({page}) => {
  await page.goto('/glass-wrap/');

  await enterMeasurements(page);

  await expect(page.locator('#download')).toBeEnabled();
  await expect(page.locator('#download-png')).toBeEnabled();

  await page.locator('#glue-tab').check();
  await page.locator('#filled-template').check();
  const outline = await page.locator('#preview path').getAttribute('d');
  await page.locator('#unit').selectOption('cm');
  await expect(page.locator('#top-diameter')).toHaveValue('8');
  await expect(page.locator('#bottom-diameter')).toHaveValue('7');
  await expect(page.locator('#glass-height')).toHaveValue('12');
  await expect(page.locator('#preview path')).toHaveAttribute('d', outline);
  await expect(page.locator('#download')).toBeEnabled();
  await expect(page.locator('#download-png')).toBeEnabled();
});

test('Glass Wrap updates its preview and SVG download for glue tabs and filled templates', async ({page}) => {
  await page.goto('/glass-wrap/');
  await enterMeasurements(page, {top: '80', bottom: '80', height: '120'});

  const contourPath = await page.locator('#preview path').getAttribute('d');
  await expect(page.locator('#preview path')).toHaveAttribute('fill', 'none');

  await page.locator('#glue-tab').check();
  await page.locator('#filled-template').check();
  await expect(page.locator('#preview path')).toHaveAttribute('fill', '#f1749e');
  await expect(page.locator('#preview path')).not.toHaveAttribute('d', contourPath ?? '');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('glass-wrap-straight-with-tab.svg');
  const svg = await readFile(await download.path(), 'utf8');
  expect(svg).toContain('fill="#f1749e"');
  expect(svg).toContain('rotate(-90)');
});

test('Glass Wrap downloads a PNG after a valid template is shown', async ({page}) => {
  await page.goto('/glass-wrap/');
  await enterMeasurements(page);

  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download-png').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('glass-wrap-conical.png');
  expect((await readFile(await download.path())).subarray(1, 4).toString()).toBe('PNG');
});
