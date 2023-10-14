import { useQuery } from 'react-query';

import { UUID } from '../types';
import { getUserToken } from '../utils/functions/token';
import { buildCurrentMemberKey, buildMemberKey } from './utils';

export const useMember = (
  id?: UUID,
  { enabled = true }: { enabled?: boolean } = {},
) => {
  const userToken: any = getUserToken();

  return useQuery({
    ...buildMemberKey(userToken, enabled, id),
    retry: false,
  });
};

export const useCurrentMember = () => {
  const userToken: any = getUserToken();

  return useQuery({
    ...buildCurrentMemberKey(userToken),
    retry: false,
  });
};
