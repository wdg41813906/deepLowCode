const path = require('path')
const webpack = require('webpack')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']
// const isProduction = process.env.NODE_ENV === 'production'

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// let CompressionPlugin = require("compression-webpack-plugin");
// const JavaScriptObfuscator = require('webpack-obfuscator');
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV !== 'production'
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
console.log(isProduction)

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  publicPath: '/',

  // 那么将这个值改为 `/my-app/`
  // baseUrl: './',
  // 放置静态资源的地方 (js/css/img/font/...)
  assetsDir: './',

  // 将构建好的文件输出到哪里 
  outputDir: 'static',

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // productionGzip: true,

  pages: {
    index: {
      // entry for the page
      entry: 'src/main.js',
      // the source template
      template: 'public/index.html',
      // output as dist/index.html
      filename: 'index.html',
      // when using title option,
      // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Vuestic Admin',
      // chunks to include on this page, by default includes
      // extracted common chunks and vendor chunks.
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },

  devServer: {
    /*
    * open：打开浏览器
    * */
    // open: (process.env.NODE_ENV === 'development'),
    open: true,
    host: '0.0.0.0',
    port: 19598,
    https: false,
    hotOnly: true,//热更新
    disableHostCheck: true,
    // 查阅 https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/cli-service.md#配置代理
    proxy: {       //可配置多个代理 string | Object  
      '/api': {
        target: '',
        ws: true,
        changeOrigin: true,//处理跨域的问题
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    // proxy: proxyObj
  },

  chainWebpack (config) {
    // 修改prefetch：
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload');
    // // 压缩代码
    // config.optimization.minimize(true);
    // // 分割代码
    // config.optimization.splitChunks({
    //   chunks: 'all'
    // })
    // // 修改prefetch：
    // config.plugin('prefetch').tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || []
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/)
    //   return options
    // })
    // const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    // types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
    console.log(config)
  },

  // configureWebpack: (config) => {

  //   config.mode = 'production'
  //   // 将每个依赖包打包成单独的js文件
  //   let optimization = {
  //     minimizer: [new UglifyJsPlugin({
  //       parallel: true,
  //       // warnings: false,
  //       uglifyOptions: {

  //         warnings: false,
  //         compress: {

  //           drop_console: true,
  //           drop_debugger: false,
  //           pure_funcs: ['console.log']
  //         }
  //       }
  //     })]
  //   }
  //   Object.assign(config, {
  //     optimization
  //   })
  //   // config.entry('main').add('babel-polyfill')
  //   config.externals = {
  //     'vue': 'Vue',
  //     'vue-router': 'VueRouter',
  //     'axios': 'axios',
  //     'vuex': 'Vuex',
  //     // 'wangeditor': 'wangEditor'
  //     // 'element-ui': 'ELEMENT',
  //     // 'core-js': 'core-js'
  //   }
  //   config.resolve.alias = {
  //     // alias: {
  //     'vue$': 'vue/dist/vue.esm.js',
  //     '@': path.resolve('src'),
  //     'src': path.resolve('src'),
  //     'assets': path.resolve('src/assets'),
  //     'components': path.resolve('src/components'),
  //     'services': path.resolve('src/services'),
  //     'directives': path.resolve('src/directives'),
  //     'vuestic-mixins': path.resolve('src/vuestic-theme/vuestic-mixins'),
  //     'vuestic-components': path.resolve('src/vuestic-theme/vuestic-components'),
  //     'vuestic-directives': path.resolve('src/vuestic-theme/vuestic-directives'),
  //     'vuestic-theme': path.resolve('src/vuestic-theme'),
  //     'data': path.resolve('src/data'),
  //     'vuex-store': path.resolve('src/store')
  //     // }
  //   }


  //   return {
  //     plugins: [
  //       new CompressionPlugin({
  //         filename: "[path].gz[query]",
  //         algorithm: 'gzip', //'brotliCompress'
  //         test: /\.js$|\.html$|\.css/, // + $|\.svg$|\.png$|\.jpg
  //         threshold: 10240, //对超过10k的数据压缩
  //         deleteOriginalAssets: false, //不删除原文件,
  //         minRatio: 0.8
  //       }),
  //       // js代码加密
  //       new JavaScriptObfuscator({
  //         compact: true,//压缩代码
  //         controlFlowFlattening: false,//是否启用控制流扁平化(降低1.5倍的运行速度)
  //         deadCodeInjection: false,///随机的死代码块(增加了混淆代码的大小)
  //         debugProtection: false,//此选项几乎不可能使用开发者工具的控制台选项卡
  //         debugProtectionInterval: false,//如果选中，则会在“控制台”选项卡上使用间隔强制调试模式，从而更难使用“开发人员工具”的其他功能。
  //         disableConsoleOutput: true,//通过用空函数替换它们来禁用console.log，console.info，console.error和console.warn。这使得调试器的使用更加困难。
  //         identifierNamesGenerator: 'hexadecimal',//标识符的混淆方式 hexadecimal(十六进制) mangled(短标识符)
  //         log: false,
  //         renameGlobals: false,//是否启用全局变量和函数名称的混淆
  //         rotateStringArray: true,//通过固定和随机（在代码混淆时生成）的位置移动数组。这使得将删除的字符串的顺序与其原始位置相匹配变得更加困难。如果原始源代码不小，建议使用此选项，因为辅助函数可以引起注意。
  //         selfDefending: true,//混淆后的代码,不能使用代码美化,同时需要配置 cpmpat:true;
  //         stringArray: true,//删除字符串文字并将它们放在一个特殊的数组中
  //         stringArrayEncoding: false,
  //         stringArrayThreshold: 0.75,
  //         unicodeEscapeSequence: false//允许启用/禁用字符串转换为unicode转义序列。Unicode转义序列大大增加了代码大小，并且可以轻松地将字符串恢复为原始视图。建议仅对小型源代码启用此选项。
  //       }, ['abc.js', 'index.js']) // abc.js 是不混淆的代码
  //     ],
  //   }
  // },


  configureWebpack: config => {
    // config.entry('main').add('babel-polyfill')
    config.entry.app = ["babel-polyfill", "./src/main.js"];

    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      // 'axios': 'axios',
      'vuex': 'Vuex',
      // 'wangeditor': 'wangEditor'
      // 'element-ui': 'ELEMENT',
      // 'core-js': 'core-js'
    }

    // console.log(config)
    config.resolve.alias = {

      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src'),
      'src': path.resolve('src'),
      'assets': path.resolve('src/assets'),
      'components': path.resolve('src/components'),
      'services': path.resolve('src/services'),
      'directives': path.resolve('src/directives'),
      'vuestic-mixins': path.resolve('src/vuestic-theme/vuestic-mixins'),
      'vuestic-components': path.resolve('src/vuestic-theme/vuestic-components'),
      'vuestic-directives': path.resolve('src/vuestic-theme/vuestic-directives'),
      'vuestic-theme': path.resolve('src/vuestic-theme'),
      'data': path.resolve('src/data'),
      'vuex-store': path.resolve('src/store')

    }
    return {
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "windows.jQuery": "jquery"
        }),

      ]
    }
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/sass/shared.scss";'
      },
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      },
      less: {

        javascriptEnabled: true

      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/style.less')]
    }
  }
}


// function addStyleResource (rule) {

//   rule.use('style-resource')

//     .loader('style-resources-loader')

//     .options({

//       patterns: [

//         path.resolve(__dirname, './src/assets/less/style.less'), // 需要全局导入的less

//       ],

//     })

// }
