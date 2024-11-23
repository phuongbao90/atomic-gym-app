import Reactotron from "reactotron-react-native";
// import mmkvPlugin from "reactotron-react-native-mmkv";

Reactotron.configure({
  name: "Daivietuni App",
})
  // .use(mmkvPlugin({ storage: appStorage }))
  .useReactNative({
    asyncStorage: false, // there are more options to the async storage.
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/,
    },
    editor: false, // there are more options to editor
    errors: { veto: () => false }, // or turn it off with false
    overlay: false, // just turning off overlay
  })
  .connect();
