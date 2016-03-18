Mentor2 App
===========

## Content

1. [Installation](#installation)
2. [Build](#build)
3. [How to Test In-app Purchases](#how-to-test-in-app-purchases)

## Installation

1. Run in the project directory:

  ```bash
  npm i
  npm install rnpm -g
  rnpm link react-native-in-app-utils
  cd ios
  sudo gem install cocoapods
  pod install
  ```
  
2. Now you have to set up your in-app purchases in iTunes Connect. Follow [this tutorial](http://stackoverflow.com/questions/19556336/how-do-you-add-an-in-app-purchase-to-an-ios-application) for easy explanation.
  
## Build

1. Open XCode.
2. Run in the simulator: `cmd + R` 
 
## How to Test In-app Purchases

For testing your in-app purchases you should *run the app on an actual device*. Using the iOS Simulator will always fail.

1. Set up a test account ("Sandbox Tester") in iTunes Connect. See the official documentation [here](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SettingUpUserAccounts.html#//apple_ref/doc/uid/TP40011225-CH25-SW9).

2. Run your app on an actual iOS device:

  + [Run the react-native server on the local network](https://facebook.github.io/react-native/docs/runningondevice.html) instead of localhost. 
  + Connect your device to Mac via USB
  + [Select it from the list of available devices and simulators](https://i.imgur.com/6ifsu8Q.jpg) in the top bar (it's next to the build and stop buttons).

3. Open the app and buy something with your Sandbox Tester Apple Account!
