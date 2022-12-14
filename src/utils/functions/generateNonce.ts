import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';
import * as SecureStore from 'expo-secure-store';

import { SECURE_STORE_VALUES } from '../../config/constants/constants';

export const generateNonce = async () => {
  const nonce = String.fromCharCode.apply(
    null,
    Array.from<number>(await Random.getRandomBytesAsync(16)),
  );
  await SecureStore.setItemAsync(SECURE_STORE_VALUES.NONCE, nonce);
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    nonce,
  );
};
