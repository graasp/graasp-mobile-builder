# Graasp Mobile Builder

<a href="https://gitlocalize.com/repo/9168?utm_source=badge"> <img src="https://gitlocalize.com/repo/9168/whole_project/badge.svg" /> </a>

This repository hosts the source code of the mobile app for the [Graasp Learning Experience Platform](graasp.org).

## Technology stack

This project is written in Typescript and uses Expo to create a React Native cross-platform mobile application.
The Async State Manager used is [Tanstack Query](https://tanstack.com/query/latest).

## Installing project dependencies

> **Prerequisite**
> Make sure you have a working installation of yarn available on your system.
> Also comply with the required node version set in he package.json file.

Run `yarn` inside the root folder to install all necessary dependencies.

### EAS Cli

Some commands will require you to use [the EAS CLI](https://www.npmjs.com/package/eas-cli). We recommend you to run these commands using `npx` or `yarn dlx`. For example: `npx eas-cli account:view`.

<details>
<summary>Alternatively you can install the eas cli globally (not recommended).</summary>

You should install the EAS CLI to manage the development and build of the project. Run the command `npm install -g eas-cli`. Then, you need to log in to an Expo dev account using the command [expo login](https://docs.expo.dev/more/expo-cli).

</details>

### Adding new dependencies

If you want to add a new package to the project, use the `yarn expo install <package>` command. This will determine the version of the package that has the best compatibility with the current expo version. :warning: It will not necessarily install the latest version of the package.

Run `yarn start --dev-client` to start a development client on a simulator. See [the Testing the app in a simulator](#running-the-app-in-a-simulator) section to learn how to install and run the app in a simulator.

### Local environment variables

Create a file called `.env.development` with the following content:

```sh
# Google service files for the Firebase service
# paths need to be absolute, relative paths will not work !
# these variables are only used during build step, they do not need to be exposed to the app with the EXPO_PUBLIC_ prefix
GOOGLE_SERVICES_INFO_PLIST=~/path/to/folder/GoogleService-Info.plist
GOOGLE_SERVICES_JSON=~/path/to/folder/google-services.json

EXPO_PUBLIC_BUILDER_HOST=http://localhost:3111
EXPO_PUBLIC_PLAYER_HOST=http://localhost:3112
EXPO_PUBLIC_LIBRARY_HOST=http://localhost:3005
EXPO_PUBLIC_SHORT_HOST=http://localhost:8888

# Variable accessible to the application code
# optionally provide the API server base url
EXPO_PUBLIC_API_HOST=http://localhost:3000
# optionally provide the Auth frontend base url
EXPO_PUBLIC_AUTH_HOST=http://localhost:3001

# sentry
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_SENTRY_ORG=
EXPO_PUBLIC_SENTRY_PROJECT=

# Optional
EXPO_PUBLIC_CAMERA_ITEM_URL=some-url
```

Save the `GoogleService-Info.plist` and `google-services.json` files somewhere in your computer and copy the absolute path into the env variables. :warning: It is not advised to put them at the root of the project.

## Running the app in a Simulator

First, you need to install Xcode (only available on Mac) or Android Studio and create a virtual device. To create one:

- **Xcode:** In the options bar click **Xcode** -> **Open Developer Tool** -> **Simulator**. Once the Simulator app is opened, you can choose different iOS devices in **File** -> **Open Simulator**.
- **Android Studio:** In the Welcome panel click on the three dots menu located in the right upper part -> **Virtual Device Manager** -> **Create device**.

Secondly, you need to generate a binary file of the app to install in the previous simulator.

- **Remote**: One solution is to build on expo servers by running the command `eas build --profile development-simulator` inside the project terminal. **You need to be part of the Graasp expo organization to build on EAS servers**. Then the prompt will ask which operating systems binary files you want to generate. This build takes time. You can download it from Expo Services or the link generated in the terminal once the build process is completed.
  - **For iOS:** it generates an `.app` file.
  - **For Android:** it generates a `.ipa` file. Notice that this format differs from the one generated on production, an `.abb` file.
- **Local**: Otherwise you can build locally following [this guide](https://graasp.github.io/docs/developer/mobile-app/local-setup).

Then you can drag and drop the file directly inside a running simulator to install it.

Once the app is installed in a simulator, you need to launch a development server from your project to update the changes you made in the app automatically. Run the command `yarn start --dev-client` and select option i to open the iOS simulator and the Android simulator. You must have the simulator opened and launched before starting the development server. The app should be automatically launched in the simulator. If you make a change and save the file inside your project, the simulator app should be reloaded automatically.

Notice that major changes in the app need to build a new entire binary file. For example, this includes changes made to the `app.config.js` file.

### Extra configuration for Android local build on Mac

- Install Android Studio
- Run `brew install openjdk@17`
- Run `export ANDROID_HOME=/Users/<username>/Library/Android/sdk/`
- Add the following line in your `.env.local` file.

```sh
ANDROID_SDK_ROOT=/Users/<username>/Library/Android/sdk
```

## Building and publishing

In this section we describe the process and the setting steps needed to create a production build of the app for iOS and Android suitable for distribution on TestFlight/AppStore and PlayStore Internal testing and PlayStore (production).

### Ensuring the dependencies are compatible together

This should be handled by a CI check. But if you run into issues during the expo doctor step you should run `npx expo install --check` when prompted to fix the versions, say "yes".

### Ensuring the Firebase files are available

You should have set the absolute path to the google services files (.plist and .json) as described in [the Local Environnement Variables](#local-environment-variables) section. For a more detailed explaantion of the setup process for local build you can check out [the full local building guide](https://graasp.github.io/docs/developer/mobile-app/local-setup)

**Warning**: If you are building locally, the environnement variables are not pulled automatically from the env files, we use the `env-cmd` package to bring them in the execution environment. This should be taken care of in the pre-defined build commands in `package.json`.

### Bumping version numbers

Defined in `app.config.js` file.

On iOS a build is identified by its version and build number, that combination has to be unique. You will not be able to upload a version with the same build number. When bumping the version you should reset the build number to `1`. If building the same version again, please increment the `build number`.
On Android you have to increment the `versionCode` to achieve the same effect.

General guidance on version numbers:

- **Version:** displayed version to the user in the AppStore/PlayStore. It should always be superior to the latest published version.
- **iOS -> Build number:** It is the build number associated with the version. For example, Version: 1.1.2 Build number: 3. It should be superior to the latest published version's build number for the same version. If you change to a superior version number, the build number should start from 1 again.
- **Android -> Version Code:** It is mandatory to be superior to the latest published one and it is not associated with the version number. For example, if the previous version was: Version 1.1.2 Version Code 45, and you want to increment the version because of a small change, it should be Version 1.1.3 Version Code 46. You cannot start the version code to 1 if you change the version number.

### Building production app bundles

> **NOTE:**
> If you encounter an issue related to fingerprints while building for iOS, you might have to download an updated Apple Certificate. For more info see [this forum post](https://developer.apple.com/forums/thread/662300). You should ultimately download [the updated Developer Relations Intermediate Certificate](https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer).

> **Warning**
> make sure you use the production commands in these steps so the built apps point to the production apis, have the production firebase configs etc ...

#### iOS

Running `yarn build:ios:prod` should generate a local build of the iOS bundle. The file will be called something like `build-1701795453442.ipa`.
This file can be added to [the Transporter app](https://apps.apple.com/us/app/transporter/id1450874784) which allows you to send app bundles to AppStore Connect where you can manage them.

#### Android

You can either generate a `.apk` file so users can install it directly on their devices, or a `.abb` file that can be submitted to the PlayStore and downloaded by internal testers.

## Testing

### Local E2E Testing with Detox

#### Configure and run local Detox tests

Detox framework needs to access native code to perform the tests, so it is necessary to build the iOS and Android bundles locally and use a config plugin to inject the native code from our Expo-managed workflow. Follow these phases to set up the Detox local environment:

##### Prerequisites

- Run `prebuild:test:ios` and `prebuild:test:android` to generate an `ios` or `android` folders that contain native projects. On iOS, it is necessary first to have Cocoapods installed on your macOS computer:
  - Check you have the latest version of Ruby. The best way to install the latest version is through Homebrew `brew install cocoapods`. Remember to restart the Terminal or the computer to save the changes.
  - Install Cocoapods by running `sudo gem install cocoapods` and `sudo gem install cocoapods -n /usr/local/bin`. If everything is correct, you should be able to use the command `pod`. You can check the version you use with `pod --version`.
- The tests uses a refresh token to access a test account. This account should already own the `e2e/fixtures/stage` structure.

##### Commands

Once you have successfully generated the native projects in the `ios` and `android` folders, use the following commands:

- Add the local environment variables before the build. You can use `.env.test`. `.env.development` takes precedence over `.env.test`!
- Run `yarn build:test:ios` or `yarn build:test:android` to build the iOS or Android app inside its corresponding folder.
- Open the corresponding simulator and run `yarn start:test` to open the development server up.
- Run `yarn test:ios` or `yarn test:android` to run the tests over the previously generated build.

When all tests have been executed, Detox saves screenshots of the failing ones in the folder `./artifacts`.

Note: `<detox config>` is obtained from the `.detoxrc.js` configuration file, where you can edit the specific simulator you are using. It has been tested successfully using `iPhone 14` and `pixel_4` (API 33) simulators.

### EAS E2E Testing with Detox

It is also possible to run the tests through the EAS service, without building native projects locally. You have to generate a new build of the app each time using the EAS service and selecting the EAS profile `test`. For executing the tests for both platforms, run `eas build -e test`.

Complete documentation to set up testing:

- [https://docs.expo.dev/build-reference/e2e-tests/#1-initialize-a-new-bare-workflow-project](https://docs.expo.dev/build-reference/e2e-tests/#1-initialize-a-new-bare-workflow-project)
- [https://github.com/expo/config-plugins/tree/main/packages/detox](https://github.com/expo/config-plugins/tree/main/packages/detox)
- [https://wix.github.io/Detox/docs/19.x/introduction/getting-started](https://wix.github.io/Detox/docs/introduction/getting-started)<https://wix.github.io/Detox/docs/introduction/getting-started>
