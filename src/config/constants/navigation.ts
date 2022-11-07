enum fontWeights {
    NORMAL = 'normal',
    BOLD = 'bold',
  };
  
  enum titleAligns {
    LEFT = 'left',
    CENTER = 'center',
  };
  
  const defaultScreenOptions = {
    headerStyle: {
      backgroundColor: '#5050d2',
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
  
  
  export {
    defaultScreenOptions,
    headerTextStyles,
  }
  