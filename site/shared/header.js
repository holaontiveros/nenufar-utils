import {html, mountArrow, reactive} from './arrow-runtime.js';
import {headerOptions} from './header-config.js';
import {getSessionStorage} from './locale.js';
import {createPageLanguage, setPageLanguage} from './page-language.js';
import {shopUrl} from './shop-links.js';

function headerTemplate(state, languageStorage) {
  return html`
    <header class="nenufar-apps-header">
      <div class="nenufar-apps-header__inner">
        <a class="nenufar-apps-header__brand" href="${() => state.rootPath}" aria-label="Nenúfar Apps home">
          <img src="${() => state.logoPath}" alt="Nenúfar Regalos Personalizados" />
        </a>
        <nav class="nenufar-apps-header__nav" data-i18n-aria="primaryNavigation" aria-label="Primary navigation">
          <a href="${() => state.rootPath}" data-i18n="apps">Apps</a>
          <a href="${() => state.shopHref}" data-i18n="shop">Shop</a>
        </nav>
        <div class="nenufar-apps-header__actions">
          <label class="language-control" for="language"><span data-i18n="language">Language</span><select id="language" value="${() => state.language.locale}" @change="${(event) => setPageLanguage(state.language, event.target.value, languageStorage)}"><option value="en">English</option><option value="es">Español</option></select></label>
        </div>
      </div>
    </header>
  `;
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-nenufar-header]').forEach((element) => {
    const languageStorage = getSessionStorage(window);
    const state = reactive({
      ...headerOptions(element),
      shopHref: shopUrl('/', {pagePath: window.location.pathname, placement: 'header'}),
      language: createPageLanguage(navigator.language, languageStorage),
    });
    mountArrow(headerTemplate(state, languageStorage), element);
  });
}
