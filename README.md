Mentor2 App
===========

## Content

1. [Installation](#installation)
2. [Running On Device](#running-on-device)
2. [Running On Simulator](#running-on-simulator)
3. [How To Test In-app Purchases](#how-to-test-in-app-purchases)

## Installation

1. Run in the project directory:

```bash
sudo npm install -g react-native-cli
sudo gem install cocoapods
npm install rnpm -g

npm i 
cd ios 
pod install
```
  
2. Now you have to set up your in-app purchases in iTunes Connect. Follow [this tutorial](http://stackoverflow.com/questions/19556336/how-do-you-add-an-in-app-purchase-to-an-ios-application) to get easy explanation.
  
## Running On Device

1. Run in the root directory `react-native bundle --entry-file index.ios.js --bundle-output ios/main.jsbundle --minify=true --platform=ios --assets-dest=./ --dev=false`
2. See [Using offline bundle](https://facebook.github.io/react-native/docs/running-on-device-ios.html)
3. Do not forget to switch the line -> `AppDelegate.m` :+1: 
4. Open XCode
5. `Do what is written paragraph 2`
6. Open project `mentor2/ops/Mentor2.xcodeproj` 
7. Start on your phone 
 
## Run On Simulator

1. Run in the root directory `react-native bundle --entry-file index.ios.js --bundle-output ios/main.jsbundle --minify=true --platform=ios --assets-dest=./ --dev=false`
2. Run `npm start` 
3. Open XCode.
4. Open project `mentor2/ops/Mentor2.xcodeproj`
5. Run in the simulator: `cmd + R`

## How To Test In-app Purchases

For testing your in-app purchases you should *run the app on an actual device*. Using the iOS Simulator will always fail.

1. Set up a test account ("Sandbox Tester") in iTunes Connect. See the official documentation [here](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SettingUpUserAccounts.html#//apple_ref/doc/uid/TP40011225-CH25-SW9).

2. Run your app on an actual iOS device:

  + [Run the react-native server on the local network](https://facebook.github.io/react-native/docs/runningondevice.html) instead of localhost. 
  + Connect your device to Mac via USB
  + [Select it from the list of available devices and simulators](https://i.imgur.com/6ifsu8Q.jpg) in the top bar (it's next to the build and stop buttons).

3. Open the app and buy something with your Sandbox Tester Apple Account!
