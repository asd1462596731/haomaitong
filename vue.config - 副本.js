// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  outputDir: 'dist',
  configureWebpack: {
    performance: {
      hints: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
    // 移除 prefetch 插件
    config.resolve.plugins.delete('prefetch')
    // 移除 preload 插件
    config.resolve.plugins.delete('preload')
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
  },
  filenameHashing: false,
  productionSourceMap: false,
  publicPath: './',
  assetsDir: 'static',
  devServer: {
	  // host: 'www.beihaomai.cn',
    // publicPath, // 和 publicPath 保持一致
    proxy: {
      '/api': {
        // target: 'https://api.zf100.hk',
		 // target: 'https://yyy.mors.top',
        target: 'http://bhm.test/',
        ws: true,
        changeOrigin: true
      }
    }
  },
  parallel: false
}
