export function shopUrl(destination, {pagePath, placement}) {
  const url = new URL(destination, 'https://nenufar.mx');
  const pageSlug = pagePath.replace(/\/index\.html$/, '/').split('/')[1];

  url.searchParams.set('utm_source', 'apps.nenufar.mx');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'nenufar-apps');
  url.searchParams.set('utm_content', `${pageSlug || 'hub'}-${placement}`);

  return url.href;
}
