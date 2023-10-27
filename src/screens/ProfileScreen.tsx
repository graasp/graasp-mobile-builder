import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, ListItem, Overlay, Text } from 'react-native-elements';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { API_ROUTES } from '@graasp/query-client';
import { formatDate } from '@graasp/sdk';

import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import ActivityIndicator from '../components/ActivityIndicator';
import DeleteAccount from '../components/DeleteAccount';
import LanguageSelector from '../components/LanguageSelector';
import CustomBackdrop from '../components/common/CustomBackdrop';
import {
  ANALYTICS_EVENTS,
  DEFAULT_LOCALE,
  STATUS_CODES_OK,
} from '../config/constants/constants';
import { useQueryClient } from '../context/QueryClientContext';
import { DrawerParamList } from '../navigation/DrawerNavigator';
import { ProfileStackParamList } from '../navigation/ProfileStackNavigator';
import { customAnalyticsEvent } from '../utils/functions/analytics';
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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { hooks } = useQueryClient();
  const [changeLanguageModalVisible, setChangeLanguageModalVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  const [deleteMemberModalVisible, setDeleteMemberVisible] = useState<{
    toggle: boolean;
  }>({
    toggle: false,
  });
  const {
    data: currentMember,
    isLoading,
    isError,
    refetch,
  } = hooks.useCurrentMember();
  const userToken: any = getUserToken();
  const bottomSheetChangeAvatarModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const { data: avatarUrl } = hooks.useAvatarUrl({
    id: currentMember && 'id' in currentMember ? currentMember?.id : undefined,
  });

  useEffect(() => {
    if (currentMember) {
      if (avatarUrl) {
        downloadAvatar(avatarUrl);
      }
    }
  }, [currentMember]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleChangeAvatarSheetChanges', index);
  }, []);

  const handleOpenBottomSheetChangeAvatarModal = useCallback(() => {
    bottomSheetChangeAvatarModalRef.current?.present();
  }, []);

  const downloadAvatar = async (url: string) => {
    try {
      if (currentMember && 'id' in currentMember) {
        const avatar = url;

        const localPath = `${FileSystem.documentDirectory}/${currentMember.id}`;

        const downloadResumable = FileSystem.createDownloadResumable(
          avatar,
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

  if (isLoading || !currentMember) {
    return <ActivityIndicator />;
  }

  if (!currentMember || !('id' in currentMember)) {
    // TODO !!!!!!! return an empty screen?
    return null;
  }

  if (isError) {
    return null;
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!file.canceled) {
      uploadAvatarImage(file);
    }
  };

  const takePhoto = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        t('You need to allow camera permission to Graasp'),
        t('Go to Settings > Graasp > Activate camera option')!,
        [{ text: 'OK' }],
      );
      return;
    }

    const file = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(file);

    if (!file.canceled) {
      uploadAvatarImage(file);
    }
  };

  const uploadAvatarImage = async (file: ImagePicker.ImagePickerResult) => {
    try {
      if (!file.assets || file.assets.length === 0) {
        throw new Error('Upload file error');
      }
      setIsUpdating(true);
      const uploadResponse = await FileSystem.uploadAsync(
        API_ROUTES.buildUploadAvatarRoute(),
        file.assets[0].uri,
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
      Toast.show({
        type: 'success',
        text1: t('Success')!,
        text2: t('Avatar updated correctly')!,
      });
      if (avatarUrl) {
        downloadAvatar(avatarUrl);
      }
      bottomSheetChangeAvatarModalRef.current?.close();
      await customAnalyticsEvent(ANALYTICS_EVENTS.CHANGE_AVATAR);
    } catch {
      setIsUpdating(false);
      Toast.show({
        type: 'error',
        text1: t('Error')!,
        text2: t('There was an error updating the avatar')!,
      });
      Alert.alert(t('Upload error'), t('Please try again')!, [{ text: 'OK' }]);
    }
  };

  const handleChangeLanguage = () => {
    setChangeLanguageModalVisible({ toggle: true });
  };

  const handleDeleteMember = () => {
    setDeleteMemberVisible({ toggle: true });
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
      <Overlay
        overlayStyle={styles.modalEditLanguage}
        isVisible={deleteMemberModalVisible.toggle}
        onBackdropPress={() => setDeleteMemberVisible({ toggle: false })}
      >
        <DeleteAccount
          currentMember={currentMember}
          setDeleteAccountVisible={setDeleteMemberVisible}
        />
      </Overlay>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
          paddingTop: 20,
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
        <Text style={styles.header}>{t('Member ID')}</Text>
        <Text style={styles.value}>{currentMember.id}</Text>
        <Text style={styles.header}>{t('Email')}</Text>
        <Text style={styles.value}>{currentMember.email}</Text>
        <Text style={styles.header}>{t('Member Since')}</Text>
        <Text style={styles.value}>
          {formatDate(currentMember.createdAt, { locale: DEFAULT_LOCALE })}
        </Text>

        <Button
          title={t('Change avatar')!}
          buttonStyle={{ backgroundColor: '#5050d2', marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'account-circle'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleOpenBottomSheetChangeAvatarModal}
        ></Button>

        <Button
          title={t('Change language')!}
          buttonStyle={{ backgroundColor: '#5050d2', marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'language'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleChangeLanguage}
        ></Button>

        <Button
          title={t('Delete my account')!}
          buttonStyle={{ backgroundColor: '#cc3333', marginTop: 20 }}
          icon={
            <MaterialIcons
              style={{ marginRight: 7 }}
              name={'delete'}
              color="#ffffff"
              size={25}
            />
          }
          onPress={handleDeleteMember}
        ></Button>
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetChangeAvatarModalRef}
        style={styles.bottomSheetModal}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={({ animatedIndex, style: backDropStyle }) => (
          <CustomBackdrop
            animatedIndex={animatedIndex}
            style={backDropStyle}
            onBackDropPressed={() =>
              bottomSheetChangeAvatarModalRef.current?.close()
            }
          />
        )}
      >
        <NativeViewGestureHandler disallowInterruption={true}>
          <View style={{ flex: 1 }}>
            <BottomSheetScrollView contentContainerStyle={null}>
              <ListItem
                onPress={() => takePhoto()}
                style={{ paddingLeft: insets.left }}
                hasTVPreferredFocus={undefined}
                tvParallaxProperties={undefined}
              >
                <MaterialIcons name="camera-alt" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Take photo')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
              <ListItem
                onPress={() => pickImage()}
                style={{ paddingLeft: insets.left }}
                hasTVPreferredFocus={undefined}
                tvParallaxProperties={undefined}
              >
                <MaterialIcons name="image" size={24} color="grey" />
                <ListItem.Content style={{ flexDirection: 'row' }}>
                  <ListItem.Title style={{ flex: 2 }}>
                    {t('Select image from media gallery')}
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </BottomSheetScrollView>
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
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
  bottomSheetModal: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default ProfileScreen;
