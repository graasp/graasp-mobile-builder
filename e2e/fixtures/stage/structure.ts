export type TestItem = {
  idx?: number;
  name: string;
  memberships?: string;
  id?: string;
  isPublished?: boolean;
  children?: { id: string }[];
};

const fixtures: {
  items: TestItem[];
} = {
  items: [
    //  idx is important when we click on the list
    {
      idx: 5,
      name: 'folder with admin permission',
      memberships: 'admin',
    },
    {
      idx: 4,
      name: 'folder with write permission',
      memberships: 'write',
    },

    { idx: 3, name: 'folder with read permission', memberships: 'read' },
    {
      id: '9214ad4e-48ca-4aa5-9a9c-c9bfd4cb19d3',
      name: 'Super sample collection',
      isPublished: true,
    },
    // item with children
    {
      id: '589da986-e00d-46cb-bb86-0ee782391f94',
      name: 'Compétences de vie',
      isPublished: true,
      children: [{ id: '8c7b78b5-55a6-4209-a4c2-471ab268d2b4' }],
    },
  ],
};

export default fixtures;
