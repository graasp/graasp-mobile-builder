import axios from 'axios';

import { API_HOST } from './env';

// Axios instance used only for authentication requests.
export const axiosAuthInstance = axios.create({
  baseURL: API_HOST,
});
