/*global require, module, __dirname */

var path = require('path'),
    webpack = require('webpack');

module.exports = {
    cache: true,
    debug: true,
    entry: {
        app: './src/js/app.js'
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        publicPath: '/js/',
        filename: '[name].js',
        //filename: '[name].[hash].js',
        chunkFilename: '[chunkhash].js'
    },
    module: {
        loaders: [
            { test: /\.(hbs|handlebars)$/, loader: 'handlebars-loader' }
        ]
    },
    resolve: {
        root: path.join(__dirname, 'src/js'),
        extensions: ['', '.webpack.js', '.web.js', '.js'],
        modulesDirectories: ['./node_modules', './bower_components'],
        fallback: path.join(__dirname, 'src/js/helpers')
    },
    //amd: { jQuery: true },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            $: 'jquery',
            _: 'underscore',
            Backbone: 'backbone',
            Marionette: 'backbone.marionette'
        }),
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        ], ['normal', 'loader'])
    ]
};
