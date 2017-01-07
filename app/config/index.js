var path = require('path');
var isProduction = (process.env.NODE_ENV === 'production');
var projectDir = process.cwd();

/*
Allow requiring paths relative to the root of the project:
require('~/src');
*/
require('require-self-ref');

/*
Allow directories under lib to be used as if they were in node_modules
*/
var libDir = path.join(projectDir, 'lib');
var appModulePath = require('app-module-path');
appModulePath.addPath(libDir);

/*
Allow requiring *.marko files
*/
require('marko/node-require').install();
require('marko/compiler/config').meta = true;

/*
Enable res.marko
*/
require('marko/express');

/*
Browser Refresh
*/
require('marko/browser-refresh').enable();
require('lasso/browser-refresh').enable('*.marko *.css *.less *.styl *.scss *.sass *.png *.jpeg *.jpg *.gif *.webp *.svg');

/*
ES Modules
*/
require('babel-register')({
    ignore: /node_modules/,
    plugins: [
        require('babel-plugin-transform-es2015-modules-commonjs'),
    ],
});

/*
Lasso
*/
require('lasso').configure({
    plugins: [
        require('lasso-marko') // Auto compile Marko template files
    ],

    // Directory where generated JS and CSS bundles are written
    outputDir: path.join(process.cwd(), './.cache/static'),

    // URL prefix for static assets
    urlPrefix: '/static',

    // Only bundle up JS and CSS files in production builds
    bundlingEnabled: isProduction,

    // Only minify JS and CSS files in production builds
    minify: isProduction,

    // Only fingerprint JS and CSS files in production builds
    fingerprintsEnabled: isProduction
});