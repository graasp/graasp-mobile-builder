const appConfig = require('../../app.config.js');

export const getAppId = () => appConfig?.expo?.extra?.eas?.projectId ?? '';

export const sleep = (t: number) => new Promise(res => setTimeout(res, t));