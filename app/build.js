// only needed until we publish some of the internal packages that live in /lib
require('./config');

var path = require('path');
var routes = require('./src/routes');
var reversePath = require('reverse-path');
var staticDir = path.join(process.cwd(), './src/static');
var buildDir = path.join(process.cwd(), './build');
var localServer = 'http://localhost:8080';
var fork = require('child_process').fork;
var request = require('request-promise');
var fs = require('mz/fs');

// Start the app
var app = fork(path.join(__dirname, './index.js'));

// Build the static site
routes.get().then(routes => {
    var paths = [];

    routes.forEach(route => {
        if(route.params.length) {
            route.params.forEach(param => {
                paths.push(reversePath(route.path, param))
            });
        } else {
            paths.push(route.path);
        }
    });

    return paths;
}).then(paths => {
    var pages = paths.map(path => {
        var url = localServer + path;
        var file = buildDir + path + (/.w+$/.test(path) ? '' : '/index.html' )

        return request(url).then(args => {
            var html = args[0];
            return fs.outputFile(file, html);
        });
    });

    return Promise.all(pages);
}).then(() => {
    return fs.move(staticDir, path.join(buildDir, './static'));
}).then(() => {
    console.log('Build successful.');
}).catch(error => {
    console.error(error);
}).then(() => {
    app.kill();
    process.exit(0);
});