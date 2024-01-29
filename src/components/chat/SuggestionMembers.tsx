import { FC } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Member, UUID } from '@graasp/sdk';

import { PRIMARY_LIGHT_COLOR } from '../../config/constants/constants';
import { useQueryClient } from '../../context/QueryClientContext';

interface SuggestionMembersProps {
  itemId: UUID;
  keyword: any;
  onSuggestionPress: any;
}

const SuggestionMembers: FC<SuggestionMembersProps> = ({
  itemId,
  keyword,
  onSuggestionPress,
}) => {
  const { hooks } = useQueryClient();
  const {
    data: itemMemberships,
    isLoading: isLoadingItemMemberships,
    isError: isErrorItemMemberships,
  } = hooks.useItemMemberships(itemId);

  if (isLoadingItemMemberships || !itemMemberships) {
    return null;
  }
  if (isErrorItemMemberships) {
    console.error('Error in SuggestionMembers');
    return null;
  }

  if (keyword == null) {
    return null;
  }

  const chatMembers: Pick<Member, 'id' | 'name'>[] = itemMemberships.map(
    ({ member }) => ({
      id: member.id,
      name: member.name,
    }),
  );

  return (
    <View style={styles.suggestionContainer}>
      {chatMembers
        .filter(({ name }) =>
          name.toLowerCase().includes(keyword.toLowerCase()),
        )
        .map(({ id, name }) => (
          <Pressable
            key={id}
            onPress={() => onSuggestionPress({ id, name })}
            style={{ padding: 10 }}
          >
            <Text>{name}</Text>
          </Pressable>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  suggestionContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    backgroundColor: PRIMARY_LIGHT_COLOR,
    zIndex: 1,
    borderRadius: 5,
    marginLeft: 12,
    padding: 5,
  },
});

export default SuggestionMembers;
