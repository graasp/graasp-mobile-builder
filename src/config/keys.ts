import { UUID } from '../types';
import { ROOT_ID } from './constants/constants';

export const ITEMS_KEY = 'items';
export const MEMBERS_KEY = 'members';
export const ITEM_MEMBERSHIP_KEY = 'item-membership';
export const OWN_ITEMS_KEY = [ITEMS_KEY, 'own'];
export const buildItemKey = (id: UUID) => [ITEMS_KEY, id];
export const buildItemChildrenKey = (id: UUID) => [ITEMS_KEY, id, 'children'];
export const SHARED_ITEMS_KEY = 'shared';
export const CURRENT_MEMBER_KEY = 'currentMember';
export const buildItemParentsKey = (id: UUID) => [ITEMS_KEY, id, 'parents'];
export const buildMemberIdKey = (id: UUID) => [MEMBERS_KEY, id];
export const buildCurrentMemberIdKey = () => [MEMBERS_KEY, CURRENT_MEMBER_KEY];
export const buildItemMembershipsKey = (id: UUID) => [ITEM_MEMBERSHIP_KEY, id];
export const buildItemLoginKey = (id: UUID) => [ITEMS_KEY, id, 'login'];

export const getKeyForParentId = (parentId: UUID) =>
  parentId && parentId !== ROOT_ID
    ? buildItemChildrenKey(parentId)
    : OWN_ITEMS_KEY;

export const POST_ITEM_MUTATION_KEY = 'postItem';
export const EDIT_ITEM_MUTATION_KEY = 'editItem';
export const DELETE_ITEM_MUTATION_KEY = 'deleteItem';
export const DELETE_ITEMS_MUTATION_KEY = 'deleteItems';
export const COPY_ITEM_MUTATION_KEY = 'copyItem';
export const MOVE_ITEM_MUTATION_KEY = 'moveItem';
export const SHARE_ITEM_MUTATION_KEY = 'shareItem';
export const FILE_UPLOAD_MUTATION_KEY = 'fileUpload';
export const SIGN_OUT_MUTATION_KEY = 'signOut';
