import {expect, test} from '@playwright/test';

test('Sticker Counter renders every fitting circle and keeps the 480 mm, 4 mm gap, 1 m defaults', async ({page}) => {
  await page.goto('/sticker-counter/');

  await expect(page.locator('#total')).toHaveText('144');
  await expect(page.locator('#columns')).toHaveText('8');
  await expect(page.locator('#rows')).toHaveText('18');
  await expect(page.locator('.overview-sheet .sticker')).toHaveCount(144);
});

test('Sticker Counter preserves square stickers and a correct grid with a 300 mm manual width', async ({page}) => {
  await page.goto('/sticker-counter/');

  await page.locator('#shape').selectOption('square');
  await expect(page.locator('#width-value')).toBeHidden();
  await page.locator('#vinyl-width').selectOption('manual');
  await expect(page.locator('#width-value')).toBeVisible();
  await expect(page.locator('#width-value')).toHaveCSS('background-color', 'rgb(53, 20, 49)');
  await page.locator('#width-value').fill('300');

  await expect(page.locator('#total')).toHaveText('90');
  await expect(page.locator('.overview-sheet .sticker')).toHaveCount(90);
  await expect(page.locator('.overview-sheet')).toHaveCSS('--vinyl-width', '300');
  const stickerRatio = await page.locator('.overview-sheet .sticker').first().evaluate((element) => {
    const {width, height} = element.getBoundingClientRect();
    return width / height;
  });
  expect(stickerRatio).toBeCloseTo(1, 1);

  await page.locator('#vinyl-width').selectOption('480');
  await expect(page.locator('#width-value')).toBeHidden();
});

test('Sticker Counter changes its physical labels to centimeters without changing the count', async ({page}) => {
  await page.goto('/sticker-counter/');

  await page.locator('#unit').selectOption('cm');
  await expect(page.locator('#vinyl-width option[value="480"]')).toHaveText('48 cm (Nenúfar standard)');
  await expect(page.locator('#total')).toHaveText('144');
});

test('Sticker Counter updates static Spanish copy, units, and the selected view state', async ({page}) => {
  await page.goto('/sticker-counter/');

  await page.locator('#language').selectOption('es');
  await expect(page.locator('h1')).toHaveText('Contador de stickers');
  await expect(page.locator('label[for="vinyl-width"]')).toContainText('Ancho del vinil (mm)');
  await expect(page.locator('label[for="shape"]')).toContainText('Tipo de sticker');
  await expect(page.locator('#shape option[value="circle"]')).toHaveText('Círculo');
  await expect(page.locator('#overview-button')).toHaveText('Vista general');
  await expect(page.locator('#inspection-button')).toHaveText('Inspeccionar sticker');
  await expect(page.locator('#gap').locator('option[value="4"]')).toHaveText('4 mm');

  await page.locator('#unit').selectOption('cm');
  await expect(page.locator('#gap').locator('option[value="4"]')).toHaveText('0.4 cm');
  await expect(page.locator('#used-space')).toContainText('cm');

  await page.locator('#inspection-button').click();
  await expect(page.locator('#inspection-button')).toHaveClass(/active/);
  await expect(page.locator('#overview-button')).not.toHaveClass(/active/);
});

test('Sticker Counter caps long overview sheets and retains the inspection view', async ({page}) => {
  await page.goto('/sticker-counter/');

  await page.locator('#length').selectOption('manual');
  await page.locator('#length-value').fill('3000');
  await expect(page.locator('#preview-note')).toContainText('2000 mm');
  await expect(page.locator('.overview-sheet')).toHaveCSS('--overview-length', '2000');

  await page.locator('#inspection-button').click();
  await expect(page.locator('.inspection-cell .sticker')).toBeVisible();
});

test('Sticker Counter restores an uploaded PNG to its physical size', async ({page}) => {
  await page.goto('/sticker-counter/');
  const imageData = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 60;
    return canvas.toDataURL('image/png').split(',')[1];
  });

  await page.locator('#shape').selectOption('png');
  await page.locator('#png-file').setInputFiles({name: 'sticker.png', mimeType: 'image/png', buffer: Buffer.from(imageData, 'base64')});
  await expect(page.locator('#original-size')).toContainText('10.16');

  await page.locator('#sticker-size').selectOption('manual');
  await page.locator('#size-value').fill('20');
  await page.locator('#restore-original').click();
  await expect(page.locator('#size-value')).toHaveValue('10.16');
});

test('custom rectangles preserve independent dimensions, units, and both preview aspect ratios', async ({page}) => {
  await page.goto('/sticker-counter/');
  await page.locator('#shape').selectOption('rectangle');
  await expect(page.locator('#sticker-size')).toBeHidden();
  await page.getByLabel('Sticker width (mm)', {exact: true}).fill('80');
  await page.getByLabel('Sticker height (mm)', {exact: true}).fill('30');
  await expect(page.locator('#columns')).toHaveText('5');
  await expect(page.locator('#rows')).toHaveText('29');
  await expect(page.locator('#total')).toHaveText('145');
  await expect(page.locator('.overview-sheet .sticker')).toHaveCount(145);
  const ratio = locator => locator.evaluate(element => {
    const {width, height} = element.getBoundingClientRect();
    return width / height;
  });
  expect(await ratio(page.locator('.overview-sheet .sticker').first())).toBeCloseTo(80 / 30, 1);
  await page.locator('#inspection-button').click();
  expect(await ratio(page.locator('.inspection-cell .sticker'))).toBeCloseTo(80 / 30, 1);
  await page.locator('#unit').selectOption('cm');
  await expect(page.getByLabel('Sticker width (cm)', {exact: true})).toHaveValue('8');
  await expect(page.getByLabel('Sticker height (cm)', {exact: true})).toHaveValue('3');
  await expect(page.locator('#total')).toHaveText('145');
  await page.locator('#language').selectOption('es');
  await expect(page.locator('#shape option[value="rectangle"]')).toHaveText('Rectángulo');
  await expect(page.getByLabel('Ancho del sticker (cm)', {exact: true})).toBeVisible();
  await page.getByLabel('Alto del sticker (cm)', {exact: true}).fill('0');
  await expect(page.locator('#total')).toHaveText('0');
  await expect(page.locator('#rectangle-error')).toHaveText('Ingresa un valor mayor que cero.');
  await page.locator('#shape').selectOption('square');
  await expect(page.locator('#sticker-size')).toBeVisible();
  await expect(page.locator('#rectangle-width')).toBeHidden();
  await expect(page.locator('#total')).toHaveText('144');
  await page.locator('#shape').selectOption('rectangle');
  await expect(page.locator('#rectangle-width')).toHaveValue('8');
});
