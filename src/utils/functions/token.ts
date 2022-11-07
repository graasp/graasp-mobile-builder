import { useAuth } from "../../context/authContext";

export const getUserToken = (): string | null => {
  const authContext = useAuth();
  const userToken = authContext?.state.userToken;
  
  // TODO: Check userToken null value when making requests
  /*if (userToken === null) {
    throw new NullArgument();
  }*/
  return userToken;
}