import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n, { namespaces } from '@graasp/translations';

import ar from '../langs/ar.json';
import de from '../langs/de.json';
import en from '../langs/en.json';
import es from '../langs/es.json';
import fr from '../langs/fr.json';
import it from '../langs/it.json';

const i18n = buildI18n().use(initReactI18next);

const MOBILE_NAMESPACE = 'mobile';
i18n.addResourceBundle('ar', MOBILE_NAMESPACE, ar);
i18n.addResourceBundle('de', MOBILE_NAMESPACE, de);
i18n.addResourceBundle('en', MOBILE_NAMESPACE, en);
i18n.addResourceBundle('es', MOBILE_NAMESPACE, es);
i18n.addResourceBundle('fr', MOBILE_NAMESPACE, fr);
i18n.addResourceBundle('it', MOBILE_NAMESPACE, it);
i18n.setDefaultNamespace(MOBILE_NAMESPACE);

export const useCategoriesTranslation = () =>
  useTranslation(namespaces.categories);

export default i18n;
