import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { logger } from '@/utils/logger';

import en from './locales/en.json';

const resources = {
  en: { translation: en },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  })
  .catch((error: unknown) => {
    logger.error('i18n initialization failed', error);
  });

export { i18n };
