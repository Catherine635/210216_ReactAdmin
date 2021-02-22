const {override, fixBabelImports, addLessLoader} = require('customize-cra');
module.exports = override(
    //针对antd实现按需加载：根据import来加载(使用babel-plugin-import)
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true, //自动加载相关的样式
    }),
    //使用less-loader对源码中的less变量进行重新指定
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {'@primary-color': '#1DA57A'},
    }),
);