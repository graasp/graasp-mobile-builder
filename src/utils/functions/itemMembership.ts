import { writeOrAdminPermission } from '../../config/constants/constants';
import { ItemMembership, ItemMemberships, UUID } from '../../types';

export const checkWriteOrAdminItemMembership = (
  itemId: UUID,
  currentMemberId?: UUID,
  itemMemberships?: ItemMemberships,
) => {
  let hasWriteOrAdminMembership = false;
  if (currentMemberId && itemMemberships && itemMemberships?.data[itemId]) {
    itemMemberships.data[itemId].map((itemMembership: ItemMembership) => {
      if (
        itemMembership.member.id === currentMemberId &&
        writeOrAdminPermission.includes(itemMembership.permission)
      ) {
        hasWriteOrAdminMembership = true;
      }
    });
  }
  return hasWriteOrAdminMembership;
};
