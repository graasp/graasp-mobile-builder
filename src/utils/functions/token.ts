import { useAuth } from '../../context/AuthContext';

export const getUserToken = (): string | null => {
  const { userToken } = useAuth();

  // TODO: Check userToken null value when making requests
  /*if (userToken === null) {
    throw new NullArgument();
  }*/
  return userToken;
};
