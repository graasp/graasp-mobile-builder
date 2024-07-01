# Map

We cannot use native maps since android always requires the use of google to display maps. Even if we want to use open street map, we need a google key to use the library rendering the map, to then display the tiles of open street map.

Our implementation is to display a fullscreen view of the map within Graasp Builder. This is displayed in a `WebView` in the mobile application.

One must be careful with the rights to access geolocation, that might differ from browser, browser on phone and webview within a mobile app. The app still requests the permissions as Graasp. If granted, the browser might request permissions again to finally show the current position.

## Opening an item in player

Given `isMobileApp` and `postMessage` mechanism, we can open an item in the Player View of the mobile application. However it does not work in Android Simulator (like apps).
