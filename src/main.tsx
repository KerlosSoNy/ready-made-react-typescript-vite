import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import i18next from './utils/i18n.ts'
import { Provider } from 'react-redux'
import store from './utils/redux/store.ts'
import { ensureCryptoKey } from './utils/functions/crypto.ts'
import { initializeToken } from './utils/redux/slices/tokenSlice.ts'
import { router } from './utils/router.tsx'
import { initTheme } from './utils/themeUpdate.ts'

const root = createRoot(document.getElementById('root')!);

async function initApp() {
  try {
    await initTheme();

    await ensureCryptoKey();
    await store.dispatch(initializeToken());

    root.render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </Provider>
    );
  } catch (error) {
    console.error('App initialization failed:', error);
    root.render(
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </Provider>
    );
  }
}

initApp();