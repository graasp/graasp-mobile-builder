import axios from 'axios';

import { API_HOST } from './constants/constants';

// Axios instance used only for authentication requests.
export const axiosAuthInstance = axios.create({
  baseURL: API_HOST,
});
