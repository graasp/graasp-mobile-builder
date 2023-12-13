const fixtures: {
  items: {
    idx?: number;
    name: string;
    memberships?: string;
    id?: string;
    isPublished?: boolean;
  }[];
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
  ],
};

export default fixtures;
