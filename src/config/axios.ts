import axios from 'axios';

import { API_HOST } from './constants/constants';

// Axios instance used for content data requests. It uses an axios interceptor to handle the refresh token if expired.
// export const axiosContentInstance = axios.create({
//   baseURL: API_HOST,
// });

// Axios instance used only for authentication requests.
export const axiosAuthInstance = axios.create({
  baseURL: API_HOST,
});
