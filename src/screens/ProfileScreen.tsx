import { MaterialIcons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { FC, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Text, Avatar, Button, Overlay } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as Api from '../api';
import { buildUploadAvatarImageRoute } from '../api/routes';
import ActivityIndicator from '../components/ActivityIndicator';
import LanguageSelector from '../components/LanguageSelector';
import { STATUS_CODES_OK } from '../config/constants/constants';
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
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [localPath, setLocalPath] = useState<string | undefined>(undefined);
  const [changeLanguageModalVisible, setChangeLanguageModalVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  const {
    data: currentMember,
    isLoading,
    isError,
    refetch,
  } = useCurrentMember();
  const userToken: any = getUserToken();
  console.log(currentMember);
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
        setIsUpdating(false);
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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!file.cancelled) {
      uploadAvatarImage(file);
    }
  };

  const uploadAvatarImage = async (file: any) => {
    try {
      setIsUpdating(true);
      const uploadResponse = await FileSystem.uploadAsync(
        buildUploadAvatarImageRoute(currentMember.id),
        file.uri,
        {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (!STATUS_CODES_OK.includes(uploadResponse.status)) {
        throw new Error('Upload file error');
      }
      downloadAvatar();
    } catch {
      setIsUpdating(false);
      Alert.alert('Upload error', 'Please try again', [{ text: 'OK' }]);
    }
  };

  const handleChangeAvatar = () => {
    pickImage();
  };

  const handleChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: true });
  };

  let AvatarComponent = null;
  if (!isUpdating) {
    if (localPath) {
      AvatarComponent = (
        <Avatar
          rounded
          size={120}
          title={currentMember.name.charAt(0)}
          containerStyle={styles.avatarContainer}
          source={{
            uri: localPath,
          }}
        />
      );
    } else {
      AvatarComponent = (
        <Avatar
          rounded
          size={120}
          title={currentMember.name.charAt(0)}
          containerStyle={styles.avatarContainer}
        />
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Overlay
        overlayStyle={styles.modalEditLanguage}
        isVisible={changeLanguageModalVisible.toggle}
        onBackdropPress={() => setChangeLanguageModalVisible({ toggle: false })}
      >
        <LanguageSelector
          currentMember={currentMember}
          setChangeLanguageModalVisible={setChangeLanguageModalVisible}
          refresh={refetch}
        />
      </Overlay>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
        }}
      >
        {isUpdating && (
          <Avatar
            rounded
            size={120}
            icon={{ name: 'sync', type: 'material', size: 40 }}
            containerStyle={styles.avatarContainer}
          />
        )}
        {AvatarComponent}
        <Text h4 style={styles.name}>
          {currentMember.name}
        </Text>
        <Text style={styles.header}>Member ID</Text>
        <Text style={styles.value}>{currentMember.id}</Text>
        <Text style={styles.header}>Email</Text>
        <Text style={styles.value}>{currentMember.email}</Text>
        <Text style={styles.header}>Member Since</Text>
        <Text style={styles.value}>{formatDate(currentMember.createdAt)}</Text>

        <Button
          title=" Change avatar"
          style={styles.changeAvatarButton}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={
            <MaterialIcons name={'account-circle'} color="#ffffff" size={25} />
          }
          onPress={handleChangeAvatar}
        ></Button>

        <Button
          title=" Change language"
          style={styles.changeAvatarButton}
          buttonStyle={{ backgroundColor: '#5050d2' }}
          icon={<MaterialIcons name={'language'} color="#ffffff" size={25} />}
          onPress={handleChangeLanguage}
        ></Button>
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
    borderWidth: 2,
    borderColor: '#5050d2',
  },
  changeAvatarButton: {
    marginTop: 20,
  },
  modalEditLanguage: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
});

export default ProfileScreen;
