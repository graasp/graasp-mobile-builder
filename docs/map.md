# Map

We cannot use native maps since android always requires the use of google to display maps. Even if we want to use open street map, we need a google key to use the library rendering the map, to then display the tiles of open street map.

Our implementation is to display a fullscreen view of the map within Graasp Builder. This is displayed in a `WebView` in the mobile application.
