const {AndroidConfig, withAndroidManifest} = require('@expo/config-plugins');

const withFirebaseMessagingNotificationIcon = config => {
  return withAndroidManifest(config, async config => {
    config.modResults = await setFirebaseMessagingConfig(
      config,
      config.modResults,
    );
    return config;
  });
};

async function setFirebaseMessagingConfig(_config, androidManifest) {
  // Ensure that the manifest has an application node
  const mainApplication =
    AndroidConfig.Manifest.getMainApplication(androidManifest);

  // Add the custom meta-data
  AndroidConfig.Manifest.addMetaDataItemToMainApplication(
    mainApplication,
    // value for android:name
    'com.google.firebase.messaging.default_notification_icon',
    // value for android:resource
    '@drawable/ic_notification',
    'resource',
  );

  return androidManifest;
}

module.exports = withFirebaseMessagingNotificationIcon;
