import React from 'react';
import RNFS, { writeFile } from 'react-native-fs';

console.log('[DETOX] Using mocked react-native-vision-camera');

export class VisionCamera extends React.PureComponent {
  static getAvailableCameraDevices() {
    return [
      {
        position: 'back',
      },
    ];
  }

  static async getCameraPermissionStatus() {
    return 'granted';
  }

  static async requestCameraPermission() {
    return 'granted';
  }

  async takePhoto() {
    const writePath = `${RNFS.DocumentDirectoryPath}/simulated_camera_photo.png`;

    const imageDataBase64 = 'some_large_base_64_encoded_simulated_camera_photo';
    await writeFile(writePath, imageDataBase64, 'base64');

    return { path: writePath };
  }

  render() {
    return null;
  }
}

export const useCameraDevice = () => {
  return 'somevalue';
};
