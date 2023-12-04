import { ItemType, UUID } from '@graasp/sdk';

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

// TODO
export const getIdFromUrl = (url: string) => {
  if (url.includes('graasp.org')) {
    return '553d9d89-523e-4cb3-a16d-0b3498465568';
  }
};

/* eslint-disable no-unused-expressions */
export const divideContentAndFolderItems = (children: any[]) => {
  const folders = [];
  const content = [];
  for (const item of children) {
    item.type === ItemType.FOLDER ? folders.push(item) : content.push(item);
  }
  return {
    folders,
    content,
  };
};
