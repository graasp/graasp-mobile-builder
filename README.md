# Graasp Mobile Builder

## Install the project

Run `yarn` to install all necessary dependencies.

You would need to install EAS CLI to manage the development and build of the project. Run the command `npm install -g eas-cli`. Then, you need to log in to an Expo dev account using the command [expo login](https://docs.expo.dev/more/expo-cli).

If you want to add a new package to the project, use the command `yarn expo install <package>`. This would determine the best version of the package compatible with the current version of Expo in the project and the rest of the dependencies. Not necessarily it would install the latest version of the package.

Run `yarn start --dev-client` to start a development client into a simulator. See Test the app in a simulator section to know how to install and run the app in a simulator.

### Local environment variables

#### Development environment
Create a file called `.env.development` with the following content:

```
EXPO_PUBLIC_GOOGLESERVICE_INFO_PLIST=./GoogleService-Info.plist
EXPO_PUBLIC_GOOGLE_SERVICES_JSON=./google-services.json
```

Then include the `GoogleService-Info.plist` and `google-services.json` files in the root of your project.

#### Test environment
Create a file called `.env.test` with the following content:

```
EXPO_PUBLIC_GOOGLESERVICE_INFO_PLIST=./GoogleService-Info.plist
EXPO_PUBLIC_GOOGLE_SERVICES_JSON=./google-services.json
EXPO_PUBLIC_TEST_REFRESH_TOKEN=
EXPO_PUBLIC_DETOX_MOCKED=mocked
EXPO_PUBLIC_AUTH_HOST=https://auth.stage.graasp.org
EXPO_PUBLIC_API_HOST=https://api.stage.graasp.org
```

## Test the app in a simulator

First, you need to install Xcode (only available on Mac) or Android Studio and create a virtual device. To create one:

- **Xcode:** In the options bar click **Xcode** -> **Open Developer Tool** -> **Simulator**. Once the Simulator app is opened, you can choose different iOS devices in **File** -> **Open Simulator**.
- **Android Studio:** In the Welcome panel click on the three dots menu located in the right upper part -> **Virtual Device Manager** -> **Create device**.

Secondly, you need to generate a binary file of the app to install in the previous simulator.

- **Remote**: One solution is to build on expo servers by running the command `eas build --profile development-simulator` inside the project terminal. \_You need to be part of the expo organization to build_on the eas servers. Then the prompt will ask which operating systems binary files you want to generate. This build takes time. You can download it from Expo Services or the link generated in the terminal once the build process is completed.
  - **For iOS:** it generates an `.app` file.
  - **For Android:** it generates a `.ipa` file. Notice that this format differs from the one generated on production, an `.abb` file.
- **Local**: Otherwise you can build locally following this [guide](https://graasp.github.io/docs/developer/mobile-app/local-setup).

Then you can drag and drop the file directly to a launched simulator.

Once the app is installed in a simulator, you need to launch a development server from your project to update the changes you made in the app automatically. Run the command `yarn start --dev-client` and select option i to open the iOS simulator and the Android simulator. You must have the simulator opened and launched before starting the development server. The app should be automatically launched in the simulator. If you make a change and save the file inside your project, the simulator app should be reloaded automatically.

Notice that major changes in the app need to build a new entire binary file. For example, this includes changes made to the `app.config.js` file.

## Export and publish the app

Firstly, you have to decide the correct version of the app to publish. In the `app.config.js` file:

- **Version:** displayed version to the user in the App/Play Store. It is mandatory to be superior to the latest published one.
- **iOS -> Build number:** It is the version number associated with the version. For example, Version: 1.1.2 Build number: 3. It is mandatory to be superior to the latest published one within a version. If you change to a superior version number, the build number should start from 1 again.
- **Android -> Version Code:** It is mandatory to be superior to the latest published one and it is not associated with the version number. For example, if the previous version was: Version 1.1.2 Version Code 45, and you want to increment the version because of a small change, it should be Version 1.1.3 Version Code 46. You cannot start the version code to 1 if you change the version number.

## Testing

### Local E2E Testing with Detox

#### Configure and run local Detox tests

Detox framework needs to access native code to perform the tests, so it is necessary to build the iOS and Android bundles locally and use a config plugin to inject the native code from our Expo-managed workflow. Follow these phases to set up the Detox local environment:

- Run `npx expo prebuild` to generate an `ios` and `android` folders that contain native projects. On iOS, it is necessary first to have Cocoapods installed on your macOS computer:
  - Check you have the latest version of Ruby. The best way to install the latest version is through Homebrew `brew install cocoapods`. Remember to restart the Terminal or the computer to save the changes.
  - Install Cocoapods by running `sudo gem install` cocoapods and `sudo gem install cocoapods -n /usr/local/bin`. If everything is correct, you should be able to use the command `pod`. You can check the version you use with `pod --version`.
- Once you have successfully generated the native projects in the `ios` and `android` folders, use the following commands:

  - `detox build --configuration <detox config>` to build the iOS or Android app inside its corresponding folder. Run `detox build --configuration ios.debug` to build the iOS debug version and `detox build --configuration android.debug` to build the Android debug one. You must add the local environment variables before the build.
  - `detox test --configuration <detox config>` to run the tests over the previously generated build. Run `detox test --configuration ios.debug` to run the iOS debug tests and `detox test --configuration android.debug` to run the Android debug ones. You should open the corresponding simulator and the development server up with `NODE_ENV=test yarn start --dev-client` before running the commands.
  - When all tests have been executed, Detox saves screenshots of the failing ones in the folder `./artifacts`.

    Note: `<detox config>` is obtained from the `.detoxrc.js` configuration file, where you can edit the specific simulator you are using. It has been tested successfully using `iPhone 14` and `pixel_4` (API 33) simulators.

### EAS E2E Testing with Detox

It is also possible to run the tests through the EAS service, without building native projects locally. You have to generate a new build of the app each time using the EAS service and selecting the EAS profile `test`. For executing the tests for both platforms, run `eas build -e test`.

Complete documentation to set up testing:

- [https://docs.expo.dev/build-reference/e2e-tests/#1-initialize-a-new-bare-workflow-project](https://docs.expo.dev/build-reference/e2e-tests/#1-initialize-a-new-bare-workflow-project)
- [https://github.com/expo/config-plugins/tree/main/packages/detox](https://github.com/expo/config-plugins/tree/main/packages/detox)
- [https://wix.github.io/Detox/docs/19.x/introduction/getting-started](https://wix.github.io/Detox/docs/introduction/getting-started)https://wix.github.io/Detox/docs/introduction/getting-started
