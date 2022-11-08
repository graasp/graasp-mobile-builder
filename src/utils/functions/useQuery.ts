import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

function useFocusQuery(refetch: any) {
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
}

export { useFocusQuery };
