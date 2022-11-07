import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function useFocusQuery(refetch: any) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
}

export { useFocusQuery };
