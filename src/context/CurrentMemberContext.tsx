import { createContext, useEffect } from 'react';

import { DEFAULT_LANG } from '@graasp/sdk';

import i18n from '../config/i18n';
import { useQueryClient } from './QueryClientContext';

interface CurrentMemberContextInterface {
  lang?: string;
}

const CurrentMemberContext =
  createContext<CurrentMemberContextInterface | null>(null);
CurrentMemberContext.displayName = 'CurrentMemberContext';

const CurrentMemberProvider = (props: any) => {
  const { hooks } = useQueryClient();
  const { data: currentMember1, isLoading, isError } = hooks.useCurrentMember();
  const currentMember = currentMember1 as any;
  let lang: string = DEFAULT_LANG;
  if (currentMember) {
    lang = currentMember?.extra?.lang || DEFAULT_LANG;
  }

  useEffect(() => {
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  const currentMemberContext: CurrentMemberContextInterface = { lang };

  return (
    <CurrentMemberContext.Provider value={currentMemberContext} {...props} />
  );
};

export { CurrentMemberProvider };
