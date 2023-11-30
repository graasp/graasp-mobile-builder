import { initReactI18next, useTranslation } from 'react-i18next';

import buildI18n, { namespaces } from '@graasp/translations';

import en from '../langs/en.json';
import fr from '../langs/fr.json';

const i18n = buildI18n().use(initReactI18next);

const MOBILE_NAMESPACE = 'mobile';
i18n.addResourceBundle('en', MOBILE_NAMESPACE, en);
i18n.addResourceBundle('fr', MOBILE_NAMESPACE, fr);
i18n.setDefaultNamespace(MOBILE_NAMESPACE);

export const useCategoriesTranslation = () =>
  useTranslation(namespaces.categories);

export default i18n;
