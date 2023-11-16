import { PRIMARY_COLOR } from './constants';

enum fontWeights {
  NORMAL = 'normal',
  BOLD = 'bold',
}

enum titleAligns {
  LEFT = 'left',
  CENTER = 'center',
}

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: PRIMARY_COLOR,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: fontWeights.BOLD,
  },
  headerTitleAlign: titleAligns.LEFT,
};

const headerTextStyles = {
  color: '#fff',
  fontWeight: fontWeights.BOLD,
  paddingLeft: 10,
  fontSize: 17,
};

export { defaultScreenOptions, headerTextStyles };
