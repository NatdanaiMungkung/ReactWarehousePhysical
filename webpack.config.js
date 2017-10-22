var webpack = require('webpack');

module.exports = {
    entry: [
        'script!jquery/dist/jquery.min.js',
        'script!foundation-sites/dist/js/foundation.min.js',
        './public/react.jsx'
    ],
    externals:{
        jquery: 'jQuery'
    },
    plugins:[
        new webpack.ProvidePlugin({
            '$':'jquery',
            'jquery':'jquery'
        })
    ],
    output: {
        path: __dirname,
        filename: './public/Scripts/bundle.js'
    },
    resolve: {
        root: __dirname,
        alias: {
            Main: 'public/components/Main.jsx',
            Nav: 'public/components/Nav.jsx',
            MasterData: 'public/components/MasterData.jsx',
            ApplicationStyles: 'public/styles/app.scss'
        },
        extension: ['','.js','.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                query: {
                    presets: ['react','es2015']
                },
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map'
};