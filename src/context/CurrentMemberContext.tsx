import React, { createContext, useEffect } from 'react';

import { LANGUAGES } from '../config/constants/constants';
import i18n from '../config/i18n';
import { getLangExtra } from '../utils/functions/itemExtra';
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
  const currentMember = currentMember1?.toJS() as any;
  let lang: string = LANGUAGES.EN;
  if (currentMember) {
    lang = getLangExtra(currentMember?.extra) || LANGUAGES.EN;
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
