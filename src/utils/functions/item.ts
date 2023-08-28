import { useCallback } from 'react';

import { ITEM_TYPES } from '../../config/constants/constants';
import {
  Item,
  ItemType,
  S3FileItemExtra,
  S3FileItemExtraProp,
  UUID,
} from '../../types';

// eslint-disable-next-line no-useless-escape
export const transformIdForPath = (id: UUID) => id.replace(/\-/g, '_');

export const getParentsIdsFromPath = (
  path: string,
  { ignoreSelf = false } = {},
) => {
  if (!path) {
    return [];
  }

  let p = path;
  // ignore self item in path
  if (ignoreSelf) {
    // split path in half parents / self
    // eslint-disable-next-line no-useless-escape
    const els = path.split(/\.[^\.]*$/);
    // if els has only one element, the item has no parent
    if (els.length <= 1) {
      return [];
    }
    [p] = els;
  }
  const ids = p.replace(/_/g, '-').split('.');
  return ids;
};

export const isChild = (id: UUID) => {
  const reg = new RegExp(`${transformIdForPath(id)}(?=\\.[^\\.]*$)`);
  return ({ path }: { path: any }) => path.match(reg);
};

export const getChildren = (items: any[], id: UUID) =>
  items.filter(isChild(id));

export const getS3FileExtra = (
  extra?: S3FileItemExtra,
): S3FileItemExtraProp | undefined => extra?.[ItemType.S3_FILE];
