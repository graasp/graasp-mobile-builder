import { Button } from 'react-native-elements';

import { MaterialIcons } from '@expo/vector-icons';

import { PRIMARY_COLOR } from '../../config/constants/constants';

interface FileHeaderButtonProps {
  name: keyof typeof MaterialIcons.glyphMap;
  handler?: () => Promise<void>;
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
      buttonStyle={{ backgroundColor: PRIMARY_COLOR }}
      disabled={disabled}
      disabledStyle={{ backgroundColor: PRIMARY_COLOR }}
      icon={<MaterialIcons name={name} color="#ffffff" size={25} />}
      onPress={handler}
      testID={testID}
    ></Button>
  );
};

export default FileHeaderButton;
