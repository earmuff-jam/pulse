//
/**
 * clientConfig
 *
 * clientConfig stores all required keys for application
 *
 * react environment host for application
 * react websocket host for application
 * geocoding api for server - using earmuffjam
 *
 */

export const REACT_APP_LOCALHOST_URL = import.meta.env?.REACT_APP_LOCALHOST_URL || 'http://localhost:8087';
export const REACT_APP_LOCALHOST_URL_SOCKET_BASE_URL =
  import.meta.env?.REACT_APP_LOCALHOST_URL_SOCKET_BASE_URL || 'ws://localhost:8087';
export const REACT_APP_GEOCODING_MAP_API_KEY = import.meta.env?.GEOCODING_MAP_API_KEY || '';
