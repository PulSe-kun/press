const path = require('path')
module.exports = {
  productionSourceMap: false, // 源映射
  // publicPath: './',
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true
    },
    host: '0.0.0.0',
    port: 9999, // 端口号
    https: false, // https:{type:Boolean}
    open: true, // 配置后自动启动浏览器
    hotOnly: true, // 热更新
    // proxy: 'http://localhost:8080' // 配置跨域处理,只有一个代理
    proxy: {
      // 配置多个代理
      '/api': {
        target: 'http://192.168.3.198:8081',
        changeOrigin: true,
        ws: true, // websocket支持
        secure: false,
        pathRewrite: {
          // '^/': ''
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/theme/index.less')]
    }
  },
  lintOnSave: false,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}