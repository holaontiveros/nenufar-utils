import assert from 'node:assert/strict';
import test from 'node:test';

import {shopUrl} from '../../site/shared/shop-links.js';

test('tags a product link while preserving its variant and fragment', () => {
  const url = new URL(shopUrl('/products/stickers?variant=123&utm_source=old#details', {
    pagePath: '/sticker-counter/index.html',
    placement: 'results',
  }));

  assert.equal(url.origin, 'https://nenufar.mx');
  assert.equal(url.pathname, '/products/stickers');
  assert.equal(url.hash, '#details');
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    variant: '123',
    utm_source: 'apps.nenufar.mx',
    utm_medium: 'referral',
    utm_campaign: 'nenufar-apps',
    utm_content: 'sticker-counter-results',
  });
  assert.deepEqual(url.searchParams.getAll('utm_source'), ['apps.nenufar.mx']);
});

test('attributes the root index to the hub', () => {
  const url = new URL(shopUrl('/', {pagePath: '/index.html', placement: 'header'}));

  assert.equal(url.searchParams.get('utm_content'), 'hub-header');
});
