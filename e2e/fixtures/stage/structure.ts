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
      id: '1da97a2a-2454-4413-b774-59b790c108dd',
      name: 'Compétences de vie',
      isPublished: true,
      children: [{ id: '93d81850-7242-4f5d-baa9-79cfc0e25fb8' }],
    },
  ],
};

export default fixtures;
