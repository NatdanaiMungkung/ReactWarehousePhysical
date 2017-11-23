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
            Home: 'public/components/Home.jsx',
            Nav: 'public/components/Nav.jsx',
            MasterData: 'public/components/MasterData.jsx',
            Users: 'public/components/Users.jsx',
            Login: 'public/components/Login.jsx',
            API: 'public/api/API.jsx',
            ApplicationStyles: 'public/styles/app.scss',
            User: 'public/components/User.jsx',
            Attributes: 'public/components/Attributes.jsx',
            Attribute: 'public/components/Attribute.jsx',
            ReconcileGroups: 'public/components/ReconcileGroups.jsx',
            ReconcileGroup: 'public/components/ReconcileGroup.jsx',
            Statuses: 'public/components/Statuses.jsx',
            Status: 'public/components/Status.jsx',
            StandardPrices: 'public/components/StandardPrices.jsx',
            StandardPrice: 'public/components/StandardPrice.jsx',
            ChangePassword:  'public/components/ChangePassword.jsx',
            toast: 'react-toastify/dist/ReactToastify.min.css'
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