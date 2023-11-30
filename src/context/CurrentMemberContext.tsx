import { createContext, useEffect, useState } from 'react';

import { DEFAULT_LANG } from '@graasp/sdk';

import i18n from '../config/i18n';
import { useQueryClient } from './QueryClientContext';

interface CurrentMemberContextInterface {
  lang: string;
  changeLang: (newLang: string) => Promise<void>;
}

export const CurrentMemberContext =
  createContext<CurrentMemberContextInterface>({
    lang: DEFAULT_LANG,
    changeLang: async () => {},
  });
CurrentMemberContext.displayName = 'CurrentMemberContext';

const CurrentMemberProvider = (props: any) => {
  const { hooks } = useQueryClient();
  const { data: currentMember } = hooks.useCurrentMember();
  const [lang, setLang] = useState<string>(DEFAULT_LANG);
  const { mutations } = useQueryClient();
  const editMemberMutation = mutations.useEditMember();

  useEffect(() => {
    if (
      currentMember &&
      'extra' in currentMember &&
      currentMember.extra?.lang &&
      currentMember.extra?.lang !== lang
    ) {
      _changeLang(currentMember.extra.lang);
    }
  }, [currentMember]);

  const _changeLang = (newLang: string) => {
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  const changeLang = async (newLang: string) => {
    if (!currentMember) {
      console.error('current member is not logged in');
    } else {
      _changeLang(newLang);
      editMemberMutation.mutate({
        id: currentMember.id,
        extra: {
          lang: newLang,
        },
      });
    }
  };

  const currentMemberContext: CurrentMemberContextInterface = {
    lang,
    changeLang,
  };

  return (
    <CurrentMemberContext.Provider value={currentMemberContext} {...props} />
  );
};

export { CurrentMemberProvider };
