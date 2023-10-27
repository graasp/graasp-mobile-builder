import {
  ItemMembership,
  PermissionLevel,
  PermissionLevelCompare,
  UUID,
} from '@graasp/sdk';

export const checkWriteOrAdminItemMembership = (
  itemId: UUID,
  currentMemberId?: UUID,
  itemMemberships?: ItemMembership[],
) => {
  let hasWriteOrAdminMembership = false;
  if (currentMemberId && itemMemberships) {
    itemMemberships?.map((itemMembership: ItemMembership) => {
      if (
        itemMembership.member.id === currentMemberId &&
        PermissionLevelCompare.gte(
          itemMembership.permission,
          PermissionLevel.Write,
        )
      ) {
        hasWriteOrAdminMembership = true;
      }
    });
  }
  return hasWriteOrAdminMembership;
};
