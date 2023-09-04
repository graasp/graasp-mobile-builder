# Graasp Mobile Builder

## Install the project

Run `yarn` to install all necessary dependencies. 

You would need to install EAS CLI to manage the development and build of the project. Run the command `npm install -g eas-cli`. Then, you need to log in to an Expo dev account using the command expo login.

If you want to add a new package to the project, use the command `yarn expo install <package>`. This would determine the best version of the package compatible with the current version of Expo in the project and the rest of the dependencies. Not necessarily it would install the latest version of the package.

Run `yarn start --dev-client` to start a development client into a simulator. See Test the app in a simulator section to know how to install and run the app in a simulator.


## Test the app in a simulator

First, you need to install Xcode (only available on Mac) or Android Studio and create a virtual device. To create one:
- **Xcode:** In the options bar click **Xcode** -> **Open Developer Tool** -> **Simulator**. Once the Simulator app is opened, you can choose different iOS devices in **File** -> **Open Simulator**.
- **Android Studio:** In the Welcome panel click on the three dots menu located in the right upper part -> **Virtual Device Manager** -> **Create device**.

Secondly, you need to generate a binary file of the app to install in the previous simulator.  Run the command `eas build --profile development-simulator` inside the project terminal. Then the prompt will ask which operating systems binary files you want to generate.
- **For iOS:** it generates an `.app` file.
- **For Android:** it generates a `.ipa` file. Notice that this format differs from the one generated on production, an `.abb` file.

You can download it from Expo Services or the link generated in the terminal once the build process is completed. Then you can drag and drop the file directly to a launched simulator.

Once the app is installed in a simulator, you need to launch a development server from your project to update the changes you made in the app automatically. Run the command `yarn start --dev-client` and select option i to open the iOS simulator and the Android simulator. You must have the simulator opened and launched before starting the development server. The app should be automatically launched in the simulator. If you make a change and save the file inside your project, the simulator app should be reloaded automatically.

Notice that major changes in the app need to build a new entire binary file. For example, this includes changes made to the `app.config.js` file.


## Export and publish the app

Firstly, you have to decide the correct version of the app to publish. In the `app.config.js` file:
- **Version:** displayed version to the user in the App/Play Store. It is mandatory to be superior to the latest published one.
- **iOS -> Build number:** It is the version number associated with the version. For example, Version: 1.1.2 Build number: 3. It is mandatory to be superior to the latest published one within a version. If you change to a superior version number, the build number should start from 1 again.
- **Android -> Version Code:** It is mandatory to be superior to the latest published one and it is not associated with the version number. For example, if the previous version was: Version 1.1.2 Version Code 45, and you want to increment the version because of a small change, it should be Version 1.1.3 Version Code 46. You cannot start the version code to 1 if you change the version number.

Notice that versions for internal testing published on App/Play Stores also count as versions, so normally it is better to increment the Build Number / Version Code when testing and increment the Version field when publishing on production.

Secondly, you need to run the command `eas build --profile production` inside the project terminal and select the operating systems you want to build. 
