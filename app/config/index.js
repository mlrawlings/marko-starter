var path = require('path');
var projectDir = process.cwd();

/*
Environment
*/
var NODE_ENV = process.env.NODE_ENV;
var isDev = NODE_ENV == null ||
            NODE_ENV.toLowerCase() === 'development'.slice(0, NODE_ENV.length);
var isProd = !isDev;

exports.isDev = isDev;
exports.isProd = isProd;


/*
Allow requiring paths relative to the root of the project:
require('~/src');
*/
require('require-self-ref');

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
Lasso
*/
require('lasso').configure({
    plugins: [
        require('lasso-marko') // Auto compile Marko template files
    ],

    // Directory where generated JS and CSS bundles are written
    outputDir: path.join(process.cwd(), './.cache/assets'),

    // URL prefix for static assets
    urlPrefix: '/assets',

    // Only bundle up JS and CSS files in production builds
    bundlingEnabled: isProd,

    // Only minify JS and CSS files in production builds
    minify: isProd,

    // Only fingerprint JS and CSS files in production builds
    fingerprintsEnabled: isProd
});
