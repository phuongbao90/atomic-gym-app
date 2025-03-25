const { withDangerousMod, withPlugins } = require("@expo/config-plugins");
const {
  mergeContents,
} = require("@expo/config-plugins/build/utils/generateCode");
const fs = require("fs");
const path = require("path");

async function readFileAsync(path) {
  return fs.promises.readFile(path, "utf8");
}

async function saveFileAsync(path, content) {
  return fs.promises.writeFile(path, content, "utf8");
}

const withFixBuildSettings = (c) => {
  return withDangerousMod(c, [
    "ios",
    async (config) => {
      const file = path.join(config.modRequest.platformProjectRoot, "Podfile");
      const contents = await readFileAsync(file);
      await saveFileAsync(file, fixBuildSettings(contents));
      return config;
    },
  ]);
};

const fixSrc = `
    installer.pods_project.targets.each do |target|
      leveldb_posix_file = 'Pods/leveldb-library/util/env_posix.cc'
      if File.exist?(leveldb_posix_file)
        old_contents = File.read(leveldb_posix_file)
        new_contents = old_contents.gsub(/std::memory_order::memory_order_relaxed/, "std::memory_order_relaxed")
        File.chmod(0777, leveldb_posix_file)
        File.open(leveldb_posix_file, "w") { |file| file.puts new_contents }
      end
      if target.name == 'abseil'
        Pod::UI.puts "Workaround: Configuring abseil to use gnu++14 language standard for cocoapods 1.16+ compatibility".yellow
        Pod::UI.puts "            Remove workaround when upstream issue fixed https://github.com/firebase/firebase-ios-sdk/issues/13996".yellow
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'gnu++14'
        end
      end
    end
`;

function fixBuildSettings(src) {
  return mergeContents({
    tag: `rn-firebase-fix-build`,
    src,
    newSrc: fixSrc,
    anchor: /post_install do \|installer\|/,
    offset: 1,
    comment: "#",
  }).contents;
}

module.exports = (config) => withPlugins(config, [withFixBuildSettings]);
