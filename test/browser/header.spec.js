import {expect, test} from '@playwright/test';

test('the shared header keeps the selected language while navigating between apps', async ({page}) => {
  await page.goto('/');

  await expect(page.getByRole('link', {name: 'Nenúfar Apps home'})).toBeVisible();
  await page.locator('#language').selectOption('es');
  await expect(page.locator('h1')).toHaveText('Apps');

  await page.goto('/sticker-counter/');
  await expect(page.locator('#language')).toHaveValue('es');
  await expect(page.locator('#page-title')).toHaveText('Contador de stickers');
});

for (const [path, app] of [['/', 'hub'], ['/glass-wrap/', 'glass-wrap'], ['/sticker-counter/', 'sticker-counter']]) {
  test(`shop links on ${path} carry app attribution`, async ({page}) => {
    await page.goto(path);

    const headerLink = page.locator('[data-nenufar-header] a[data-i18n="shop"]');
    await expect(headerLink).toBeVisible();

    const destination = new URL(await headerLink.getAttribute('href'));
    expect(destination.origin).toBe('https://nenufar.mx');
    expect(destination.pathname).toBe('/');
    expect(destination.searchParams.get('utm_content')).toBe(`${app}-header`);

    const shopLinks = await page.locator('a[href]').evaluateAll((links) => links
      .map((link) => link.href)
      .filter((href) => ['nenufar.mx', 'www.nenufar.mx'].includes(new URL(href).hostname)));
    for (const href of shopLinks) {
      const params = new URL(href).searchParams;
      expect(params.get('utm_source')).toBe('apps.nenufar.mx');
      expect(params.get('utm_medium')).toBe('referral');
      expect(params.get('utm_campaign')).toBe('nenufar-apps');
      expect(params.get('utm_content')).toMatch(new RegExp(`^${app}-.+`));
    }
  });
}
