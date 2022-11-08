import qs from 'qs';

import { UUID } from '../types';

export const ITEMS_ROUTE = 'items';
export const GET_OWN_ITEMS_ROUTE = `${ITEMS_ROUTE}/own`;
export const SHARE_ITEM_WITH_ROUTE = `${ITEMS_ROUTE}/shared-with`;

export const buildGetChildrenRoute = (id: UUID) =>
  `${ITEMS_ROUTE}/${id}/children`;
export const buildGetItemRoute = (id: UUID) => `${ITEMS_ROUTE}/${id}`;

export const MEMBERS_ROUTE = `members`;
export const buildGetMemberBy = (email: string) =>
  `${MEMBERS_ROUTE}?email=${email}`;
export const buildGetMember = (id: UUID) => `${MEMBERS_ROUTE}/${id}`;
export const buildUploadFilesRoute = (parentId: UUID) =>
  parentId
    ? `${ITEMS_ROUTE}/upload?parentId=${parentId}`
    : `${ITEMS_ROUTE}/upload`;
export const GET_CURRENT_MEMBER_ROUTE = `${MEMBERS_ROUTE}/current`;
export const buildSignInPath = (to: any) => {
  const queryString = qs.stringify({ to }, { addQueryPrefix: true });
  return `signin${queryString}`;
};
export const SIGN_OUT_ROUTE = 'logout';
