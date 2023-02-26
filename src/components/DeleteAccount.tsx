import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useMutation } from 'react-query';

import { ANALYTICS_EVENTS } from '../config/constants/constants';
import { useAuth } from '../context/authContext';
import { buildDeleteMember } from '../mutations/utils';
import { Member } from '../types';
import { customAnalyticsEvent } from '../utils/functions/analytics';
import { getUserToken } from '../utils/functions/token';

interface DeleteAccountProps {
  currentMember: Member;
  setDeleteAccountVisible: React.Dispatch<
    React.SetStateAction<{
      toggle: boolean;
    }>
  >;
}

const DeleteAccount: FC<DeleteAccountProps> = ({
  currentMember,
  setDeleteAccountVisible,
}) => {
  const { t } = useTranslation();
  const userToken: any = getUserToken();
  const authContext = useAuth();
  const { signOut } = authContext;
  const deleteMemberMutation = useMutation({
    ...buildDeleteMember(userToken),
  });

  const deleteItem = async () => {
    setDeleteAccountVisible({ toggle: false });
    signOut();
    deleteMemberMutation.mutate(currentMember.id);
    await customAnalyticsEvent(ANALYTICS_EVENTS.DELETE_MEMBER);
  };

  return (
    <>
      <Text style={styles.valueTitle}>{`${t('Confirm deletion')}`}</Text>
      <Text style={styles.value}>{`${t(
        'Your account will be deleted permanently',
      )}`}</Text>
      <View style={styles.deleteAccount}>
        <Button
          title={t('Delete permanently')!}
          raised={true}
          buttonStyle={{ backgroundColor: '#cc3333' }}
          onPress={deleteItem}
        />
      </View>
      <Button
        title={t('Cancel')!}
        raised={true}
        buttonStyle={{ backgroundColor: '#b5b5b5' }}
        onPress={() => setDeleteAccountVisible({ toggle: false })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  deleteAccount: {
    marginBottom: 10,
  },
  valueTitle: {
    paddingBottom: 30,
    fontSize: 20,
    fontWeight: '700',
  },
  value: {
    paddingBottom: 30,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default DeleteAccount;
