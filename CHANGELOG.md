# Changelog

## [1.4.1](https://github.com/graasp/graasp-mobile/compare/v1.4.0...v1.4.1) (2024-05-29)


### Bug Fixes

* fix bookmark changes ([548a135](https://github.com/graasp/graasp-mobile/commit/548a135a2eab846eb2605aba5e300618de3c4b11))

## [1.4.0](https://github.com/graasp/graasp-mobile/compare/v1.3.1...v1.4.0) (2024-05-29)


### Features

* use phone lang on signed out, add more langs, remove toast on signed out ([#215](https://github.com/graasp/graasp-mobile/issues/215)) ([e371cee](https://github.com/graasp/graasp-mobile/commit/e371ceec62c4849d539457ee7468c328a00c8a13))

## [1.3.1](https://github.com/graasp/graasp-mobile/compare/v1.3.0...v1.3.1) (2024-05-15)


### Bug Fixes

* allow scroll when keyboard is open on home screen
* allow uuid in input to go to item
* fix crash for ios on view map: postmessage could get non-json data
* fix ios cannot read qr: it needed to use `expo-camera`, also because it was deprecated. I took this opportunity to add a close button on the camera view.
* add map button to Shared Elements screen: this solution is faster than using accessible for now
* officially request location from app config
* display "submit" button (go to item by url) under input field.

## [1.3.0](https://github.com/graasp/graasp-mobile/compare/v1.2.0...v1.3.0) (2024-05-01)


### Features

* add message event to open item in player view ([#205](https://github.com/graasp/graasp-mobile/issues/205)) ([6203971](https://github.com/graasp/graasp-mobile/commit/620397154a5af29b48e8473cc4e8a158f0a5684e))

## [1.2.0](https://github.com/graasp/graasp-mobile/compare/v1.1.14...v1.2.0) (2024-04-29)


### Features

* change application name to Graasp ([#200](https://github.com/graasp/graasp-mobile/issues/200)) ([09c1005](https://github.com/graasp/graasp-mobile/commit/09c10054da416954f42cd5a138ad6015295c7556))
* update ios sdk ([#203](https://github.com/graasp/graasp-mobile/issues/203)) ([56211af](https://github.com/graasp/graasp-mobile/commit/56211af95bff7a2e19d43e47205a8eb3a27d3012))


### Bug Fixes

* build aab app ([e1e3c83](https://github.com/graasp/graasp-mobile/commit/e1e3c8367ee1211d07d7859044caab7a4b9f1883))

## [1.1.14](https://github.com/graasp/graasp-mobile/compare/v1.1.13...v1.1.14) (2024-04-23)

### Miscellaneous Chores

- release 1.1.14 ([4a95de9](https://github.com/graasp/graasp-mobile/commit/4a95de9a77c0f3f1142a4ff6bbc9a64fb19992d7))

## [1.1.13](https://github.com/graasp/graasp-mobile/compare/v1.1.11...v1.1.13) (2024-04-19)

### Features

- build trigger ([3654e3b](https://github.com/graasp/graasp-mobile/commit/3654e3b7cd0d65176ba43963b97dcf304d838afe))
- fix workflows ([244ec48](https://github.com/graasp/graasp-mobile/commit/244ec482590382e2bf0243cfa7bec96cb9d65887))

### Miscellaneous Chores

- release 1.1.12 ([02186a3](https://github.com/graasp/graasp-mobile/commit/02186a3ebf5a95c04b16dee7c6ef177a36739c11))
- release 1.1.13 ([3fb09de](https://github.com/graasp/graasp-mobile/commit/3fb09dee1b30fff74f4ea705a31fd86ec6bbd8da))

## [1.1.11](https://github.com/graasp/graasp-mobile/compare/v1.1.10...v1.1.11) (2024-04-19)

### Miscellaneous Chores

- release 1.1.11 ([e99c069](https://github.com/graasp/graasp-mobile/commit/e99c069bd258cae2a24da11c85e1cc4e8a60398c))

## [1.1.10](https://github.com/graasp/graasp-mobile/compare/v1.1.9...v1.1.10) (2024-04-19)

### Miscellaneous Chores

- release 1.1.10 ([be5d0c3](https://github.com/graasp/graasp-mobile/commit/be5d0c317af64e92feaec2fb1c26476f9fef86af))

## [1.1.9](https://github.com/graasp/graasp-mobile/compare/v1.0.0...v1.1.9) (2024-04-19)

### Features

- fix app json ([972c200](https://github.com/graasp/graasp-mobile/commit/972c200dcf0f4195a78884983341216bcc26b61e))
- test ([79421eb](https://github.com/graasp/graasp-mobile/commit/79421eb6354e6829b5ff8474955148193461e65a))
- test ([dc6a59b](https://github.com/graasp/graasp-mobile/commit/dc6a59b5cae2f82884a3a39faac9432d4bf95936))

### Miscellaneous Chores

- release 1.1.9 ([8ace133](https://github.com/graasp/graasp-mobile/commit/8ace13351678c6be56ca0b211fed5fe7d28dc365))

## 1.0.0 (2024-04-19)

### Features

- add analytics events ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- add autocomplete email-password on iOS and Android ([fa3268d](https://github.com/graasp/graasp-mobile/commit/fa3268df0e937749924e35968bb423746d0c529e))
- add bookmark to collection card ([#157](https://github.com/graasp/graasp-mobile/issues/157)) ([51ee671](https://github.com/graasp/graasp-mobile/commit/51ee671448483da4a542bb27ff1722ad58ce8cde))
- add bookmarks tab ([#114](https://github.com/graasp/graasp-mobile/issues/114)) ([cc20134](https://github.com/graasp/graasp-mobile/commit/cc2013435a71af9e519d45e71e6d8251229dacb5))
- add home page with short links ([#110](https://github.com/graasp/graasp-mobile/issues/110)) ([2e8e538](https://github.com/graasp/graasp-mobile/commit/2e8e5380b2eb76336b867beb029920807c7a7eed))
- add map screen, factor out item option list ([#183](https://github.com/graasp/graasp-mobile/issues/183)) ([fc290b1](https://github.com/graasp/graasp-mobile/commit/fc290b1dfaacf09df9dcaac6bcc6a0319bfa855f))
- add missing translations ([#140](https://github.com/graasp/graasp-mobile/issues/140)) ([aa2e418](https://github.com/graasp/graasp-mobile/commit/aa2e4184ecf61aecaffbcce2f753aa4e7e39bcd8))
- add predefined and custom analytics events ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- add profile photo by taking a picture with the camera ([3451d99](https://github.com/graasp/graasp-mobile/commit/3451d999cec3dcd2f204c59865e7bf2e7e6e8efb))
- change member language option ([43a6cec](https://github.com/graasp/graasp-mobile/commit/43a6cec74db749f0568c4bd7b37fc94122ff0ffe))
- create folder item ([eba6be2](https://github.com/graasp/graasp-mobile/commit/eba6be209d2a4339fe9c3be2e74e704ed8b82cd0))
- current member context and translation ([1b3f3dc](https://github.com/graasp/graasp-mobile/commit/1b3f3dc26d3a764c1256c7bbbb30cb53486d5f0b))
- delete member account ([d3c9b7e](https://github.com/graasp/graasp-mobile/commit/d3c9b7ec58383cee075c00cabf67afdc59a5ddea))
- display add item button only on shared items with correct permits ([d610c98](https://github.com/graasp/graasp-mobile/commit/d610c98b3c1c2fd91160b34047cd1bd81dd84b70))
- display member language selector ([20c0a1c](https://github.com/graasp/graasp-mobile/commit/20c0a1c017ea32f39afc46a0de0d52f3489c4be2))
- display PDFs within the app and use streaming when viewing videos ([ee2db2a](https://github.com/graasp/graasp-mobile/commit/ee2db2a642518a0727ec34afcd4e9c857f6edcad))
- display profile information and avatar image ([d66cb66](https://github.com/graasp/graasp-mobile/commit/d66cb6699fcbc0408c157a20b0ca11aa65e20671))
- display video, audio, PDF and download unsupported files ([0e43e63](https://github.com/graasp/graasp-mobile/commit/0e43e63125e00a94d0e1e82c724d2e61fb22ab62))
- do not allow to edit or delete if membership is read ([54ded77](https://github.com/graasp/graasp-mobile/commit/54ded77ada8a0d7f4fdd09ffed4dbb82937e12a8))
- download files and display images within the app ([6c3afd5](https://github.com/graasp/graasp-mobile/commit/6c3afd59143f067f2e125de88d22e23b16011588))
- edit item name ([fbcc366](https://github.com/graasp/graasp-mobile/commit/fbcc36625c44fa6ae926ec07163ef51f41b1ee5b))
- files cache ([3a19d5a](https://github.com/graasp/graasp-mobile/commit/3a19d5a566320252609263941c07eadbc91bc5ed))
- firebase implementation and config ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- fix login logout update ([#129](https://github.com/graasp/graasp-mobile/issues/129)) ([afff4b9](https://github.com/graasp/graasp-mobile/commit/afff4b97693f5a68fa007a4e85cb3e7e6d67806c))
- Graasp Mobile Builder initial version with Expo Managed Workflow and TypeScript ([e8f42b2](https://github.com/graasp/graasp-mobile/commit/e8f42b2df39addc3933c4b72cac56c818992696a))
- implement library home page and collection summary page ([#118](https://github.com/graasp/graasp-mobile/issues/118)) ([9ba9558](https://github.com/graasp/graasp-mobile/commit/9ba95587e2728e42e3002c650df6696bb7c0adc8))
- integrate chat ([#165](https://github.com/graasp/graasp-mobile/issues/165)) ([1af52e2](https://github.com/graasp/graasp-mobile/commit/1af52e2a9c8e30773c981f7c6a7b4c789f4aaa6e))
- log in using integrated web browser auth ([e8482d3](https://github.com/graasp/graasp-mobile/commit/e8482d3b33f0afa004b7eaeb01f3ea771b78ad79))
- open item in player from qr or url ([#138](https://github.com/graasp/graasp-mobile/issues/138)) ([c509d0f](https://github.com/graasp/graasp-mobile/commit/c509d0f3d0dab66ead759fa4b591dd8b38e21f9e))
- player view ([d48abe1](https://github.com/graasp/graasp-mobile/commit/d48abe1a3666ee71303b17cae17ad9f46449438e))
- Player view mode for all folders ([4d0aef7](https://github.com/graasp/graasp-mobile/commit/4d0aef7d967b26ab6e5e5d0f3b4ae0b533f14d10))
- player view to display the entire contents of a folder ([5bacb06](https://github.com/graasp/graasp-mobile/commit/5bacb0651c49cf3e3ccf3ad035afc2622e6a30b4))
- remove item ([da1c6bc](https://github.com/graasp/graasp-mobile/commit/da1c6bc0aff1dd0c7f3304d8bb6e558919b8aa51))
- save images and videos in the device media gallery ([3caa4b5](https://github.com/graasp/graasp-mobile/commit/3caa4b5a6fc5158afb13fdbb2afec94644ba77f7))
- show alert for non handled files ([#171](https://github.com/graasp/graasp-mobile/issues/171)) ([1ed616f](https://github.com/graasp/graasp-mobile/commit/1ed616f911f7edac5efa2ed17805317891eeacff))
- support graasp apps ([#107](https://github.com/graasp/graasp-mobile/issues/107)) ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- toast notifications when file is uploaded or saved ([195c221](https://github.com/graasp/graasp-mobile/commit/195c22187d6dbb55ef28cea2e6b42ad647a217b6))
- translate ar.json via GitLocalize ([#161](https://github.com/graasp/graasp-mobile/issues/161)) ([de8931f](https://github.com/graasp/graasp-mobile/commit/de8931fa209fea9a7ff8d30e8c930e91adc65592))
- translate es.json via GitLocalize ([#162](https://github.com/graasp/graasp-mobile/issues/162)) ([14af8c7](https://github.com/graasp/graasp-mobile/commit/14af8c7cd8c7ccec2201d7b2701891557e97c03f))
- update avatar image ([52074e4](https://github.com/graasp/graasp-mobile/commit/52074e4e02e421eebd0f22b2ee71ce46b784e8f9))
- upload files to the backend by selecting from the device media gallery or file navigator ([e4117ad](https://github.com/graasp/graasp-mobile/commit/e4117adc2f8a65aae3574dfdd6bf5ea1dbed6ff8))
- use eslint and prettier for expo and react native ([050fde8](https://github.com/graasp/graasp-mobile/commit/050fde8c2099893f80c16501502be6291646f55d))
- use firebase analytics and small changes ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- use new graasp logo ([7d14d7b](https://github.com/graasp/graasp-mobile/commit/7d14d7ba12cf284f9e131e1ff0b13f008d5e8dda))
- use query client ([#99](https://github.com/graasp/graasp-mobile/issues/99)) ([08ae37a](https://github.com/graasp/graasp-mobile/commit/08ae37a02898d40c4e5d9606b66ac0334b06ebca))

### Bug Fixes

- adapt Android email password login ([9657e99](https://github.com/graasp/graasp-mobile/commit/9657e99fc73d97f49668f2a3817c8c5e4e3f36de))
- adapt new API endpoints ([a8581f9](https://github.com/graasp/graasp-mobile/commit/a8581f929b9a92260f3a9f61f230d805415a85b1))
- add babel peer dependencies ([f53defb](https://github.com/graasp/graasp-mobile/commit/f53defba6843589508e4134d37c514f041230bcb))
- add ci workflow ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- add description in details screen ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- add edit item menu with save or cancel options ([1dfd873](https://github.com/graasp/graasp-mobile/commit/1dfd873ff1a0f5300cfbdcb774103d7a4dac3757))
- add empty translations ([a0d9f6f](https://github.com/graasp/graasp-mobile/commit/a0d9f6fb89e128826b18e468a520fd777c6fc76d))
- add GestureHandlerRootView in App.tsx ([3bf3bd3](https://github.com/graasp/graasp-mobile/commit/3bf3bd3137cc99c7d467d92e2269297e8b355bb7))
- add more translations and apply lint ([49a9ac2](https://github.com/graasp/graasp-mobile/commit/49a9ac2ba8843a1c06710b9a953fc67643eb6940))
- add NativeViewGestureHandler to Bottom Sheets ([c27056e](https://github.com/graasp/graasp-mobile/commit/c27056e534747613d5ec4a8f9a416fb12614457f))
- add polyfill for URL and URLSearchParams ([#102](https://github.com/graasp/graasp-mobile/issues/102)) ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- add text alignments in document items ([fc29e0a](https://github.com/graasp/graasp-mobile/commit/fc29e0a2d8c7343577ead7fec6b67903fc4e054d))
- allow public access to map ([#185](https://github.com/graasp/graasp-mobile/issues/185)) ([c0e3596](https://github.com/graasp/graasp-mobile/commit/c0e3596159b2badfd8e31bb7dddac182bcfc6a06))
- change cache mode in pdf viewer ([2403999](https://github.com/graasp/graasp-mobile/commit/24039993a6134a57baa6dd4d826884cfdf873da4))
- change linking app name ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- changes due to SDK 49 ([0a77f09](https://github.com/graasp/graasp-mobile/commit/0a77f09551f8b35282980abe8c94b9a2ac116c42))
- cleanup eslint errors and update dependencies to match requirements of CI ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- close bottom drawer after deleting item ([390b0f2](https://github.com/graasp/graasp-mobile/commit/390b0f28259070e5e93888cdabca98c5ec12c556))
- create an env config file and remove env.json ([67d62f1](https://github.com/graasp/graasp-mobile/commit/67d62f137ddc395db9010c0dcf1a4735bddd9f4a))
- disable WebView cache in PDF viewer ([65be099](https://github.com/graasp/graasp-mobile/commit/65be099ad86e99651a79f989659d8e23c854656a))
- fix app in android, show svg thumbnail, some fixes ([#189](https://github.com/graasp/graasp-mobile/issues/189)) ([a2f093e](https://github.com/graasp/graasp-mobile/commit/a2f093e78652c180b585cc7a3910166a75cacafc))
- fix camera qr, log out logo, image max width ([#143](https://github.com/graasp/graasp-mobile/issues/143)) ([fd7109c](https://github.com/graasp/graasp-mobile/commit/fd7109c302318ab7b4cf9e3d89cf1ccaaf6ef539))
- fix dates in android with intl ([#158](https://github.com/graasp/graasp-mobile/issues/158)) ([70a85fc](https://github.com/graasp/graasp-mobile/commit/70a85fc326f1194b59c61599f6c3b8751f60aec2))
- go back to origin from player ([#149](https://github.com/graasp/graasp-mobile/issues/149)) ([8dce879](https://github.com/graasp/graasp-mobile/commit/8dce879fc67d8111c5b9584e884d01e24fdb76e4))
- graasp hostname typo ([d244d44](https://github.com/graasp/graasp-mobile/commit/d244d447be69909bd1cc233419975a916184ad28))
- improve initial loading screen ([#172](https://github.com/graasp/graasp-mobile/issues/172)) ([76411ab](https://github.com/graasp/graasp-mobile/commit/76411aba71843fe2558c89f2cd487568aec0dde1))
- minor fix ([39b6c8c](https://github.com/graasp/graasp-mobile/commit/39b6c8c56b19876c90fb7ea31a212775c4232f92))
- player navigation to child folder ([20701d1](https://github.com/graasp/graasp-mobile/commit/20701d1939620e0ab9a5271257dc6d0e8cb66433))
- prevents links to crash app for android ([#164](https://github.com/graasp/graasp-mobile/issues/164)) ([fa4e778](https://github.com/graasp/graasp-mobile/commit/fa4e7781ec8f8fc266ea1e61447d1595a48914db))
- profile style screen in android ([1611ed2](https://github.com/graasp/graasp-mobile/commit/1611ed2429b5d19778a46c809d9ea082093e8455))
- respect item order in children lists ([cf135bf](https://github.com/graasp/graasp-mobile/commit/cf135bf565d526ae1825ff775e7f0264e5c638b8))
- set WebView height and fix small bugs ([6f1fe3e](https://github.com/graasp/graasp-mobile/commit/6f1fe3ef6ee3bd80d72ba30ded31016c932a4b3f))
- solve refreshToken problem and add alert when logging in again ([2745052](https://github.com/graasp/graasp-mobile/commit/27450526777ac6cd090f7ce4e4fa73403a02489b))
- text in DetailsScreen ([3b29e7b](https://github.com/graasp/graasp-mobile/commit/3b29e7b5d624d91cf7b7433b12ac9872ba1fda5e))
- type FolderScreen ([4f10c5c](https://github.com/graasp/graasp-mobile/commit/4f10c5cb6b5cd7d5dc86e159f4b604c6c7061668))
- type ItemIcon ([634bb10](https://github.com/graasp/graasp-mobile/commit/634bb101663f6a3d3f331c1111fbcf3475ded526))
- untrack .yarn/install-state.gz ([ba614e5](https://github.com/graasp/graasp-mobile/commit/ba614e58860220683620e2ce9cdad6d2378b4952))
- upload route constant ([f54a85d](https://github.com/graasp/graasp-mobile/commit/f54a85d265e9cca9d9649faa7dd25aafc40fbf53))
