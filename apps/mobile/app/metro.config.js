const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config')
const path = require('path')
const defaultConfig = getDefaultConfig(__dirname)
const {assetExts, sourceExts} = defaultConfig.resolver
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    extraNodeModules: {
      'magen-common': path.resolve(__dirname, '../../packages/magen-common'),
    },
    resolveRequest: MetroSymlinksResolver(),
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
  watchFolders: [path.resolve(__dirname, '../../packages/magen-common')],
}

module.exports = mergeConfig(defaultConfig, config)


