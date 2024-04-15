import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { PRIMARY_COLOR } from '../../config/constants/constants';

interface FileHeaderButtonProps {
  name: keyof typeof MaterialIcons.glyphMap;
  handler?: (() => Promise<void>) | (() => Promise<boolean>);
  testID?: string;
  disabled?: boolean;
}

const FileHeaderButton = ({
  name,
  handler,
  testID,
  disabled = false,
}: FileHeaderButtonProps) => {
  return (
    <Button
      iconContainerStyle={{ width: 25 }}
      buttonStyle={{ backgroundColor: PRIMARY_COLOR, width: 40 }}
      disabled={disabled}
      disabledStyle={{ backgroundColor: PRIMARY_COLOR }}
      icon={<MaterialIcons name={name} color="#ffffff" size={25} />}
      onPress={handler}
      testID={testID}
    ></Button>
  );
};

export default FileHeaderButton;
