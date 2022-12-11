import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import React, { FC, useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Api from '../api';
import ActivityIndicator from '../components/ActivityIndicator';
import { useCurrentMember } from '../hooks/member';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';
import { formatDate } from '../utils/functions/date';
import { getUserToken } from '../utils/functions/token';

type ProfileStackProfileProps = CompositeScreenProps<
  StackScreenProps<
    ProfileStackParamList,
    'ProfileStackProfile',
    'ProfileStackNavigator'
  >,
  DrawerScreenProps<DrawerParamList>
>;

const ProfileScreen: FC<ProfileStackProfileProps> = () => {
  const { data: currentMember, isLoading, isError } = useCurrentMember();
  const [localPath, setLocalPath] = useState<string | undefined>(undefined);
  const userToken: any = getUserToken();

  const downloadAvatar = async () => {
    try {
      if (currentMember) {
        const avatar = await Api.getMemberAvatarUrl(
          currentMember.id,
          userToken,
        ).then((data) => data);

        const localPath = `${FileSystem.documentDirectory}/${currentMember.id}`;

        const downloadResumable = FileSystem.createDownloadResumable(
          avatar.url,
          localPath,
        );
        await downloadResumable.downloadAsync();

        setLocalPath(localPath);
      }
    } catch {
      throw new Error();
    }
  };

  useEffect(() => {
    if (currentMember) {
      downloadAvatar();
    }
  }, [currentMember]);

  if (isLoading || !currentMember) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
        }}
      >
        {localPath ? (
          <Avatar
            rounded
            size={120}
            source={{
              uri: localPath,
            }}
            containerStyle={styles.avatarContainer}
          />
        ) : (
          <Avatar
            size="xlarge"
            rounded
            title={currentMember.name.charAt(0)}
            containerStyle={styles.avatarContainer}
          />
        )}
        <Text h4 style={styles.name}>
          {currentMember.name}
        </Text>
        <Text style={styles.header}>Member ID</Text>
        <Text style={styles.value}>{currentMember.id}</Text>
        <Text style={styles.header}>Email</Text>
        <Text style={styles.value}>{currentMember.email}</Text>
        <Text style={styles.header}>Member Since</Text>
        <Text style={styles.value}>{formatDate(currentMember.createdAt)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  icon: {
    alignSelf: 'center',
  },
  header: {
    color: '#4e4e4e',
  },
  name: {
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  value: {
    paddingBottom: 20,
  },
  avatarContainer: {
    backgroundColor: '#5050d2',
    alignSelf: 'center',
  },
});

export default ProfileScreen;
