require('../config');

var path = require('path');
var routes = require('../server/routes');
var reversePath = require('reverse-path');
var assetsDir = path.join(process.cwd(), './.cache/assets');
var staticDir = path.join(process.cwd(), './static');
var packagePath = path.join(process.cwd(), './package.json');
var staticRepo = require(packagePath)['static-repo'];
var baseUrl = require(packagePath).baseurl;
var localServer = 'http://localhost:8080';
var fork = require('child_process').fork;
var exec = require('child_process').execSync;
var request = require('request-promise');
var fs = require('fs-promise');
var del = require('del');

// Clean compiled templates because we assume up to date in production
exec('markoc . --clean');

// Start the app
var app = fork(path.join(__dirname, '../server'), [], {
    env:{ NODE_ENV:'production' }
});

app.on('message', message => {
    if (!message) return;
    if (message === 'online' || message.event === 'online') {
        build();
    }
});

// Build the static site
var build = () => fs.emptyDir(staticDir).then(() => {
    if(staticRepo) {
        var parts = staticRepo.split('#');
        var repo = parts[0];
        var branch = parts[1] || 'master';
        exec(`cd ${staticDir} && git init && git remote add origin ${repo} && git fetch`);
        try {
            exec(`cd ${staticDir} && git checkout -t origin/${branch}`);
            del(`${staticDir}/**/*`, `!${staticDir}/.git`);
        } catch(e) {
            exec(`cd ${staticDir} && git checkout -b ${branch}`);
        }
    }
}).then(() => {
    return routes.get()
}).then(routes => {
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
        var file = staticDir + path + (/\.w+$/.test(path) ? '' : '/index.html' )

        return request(url).then(html => {
            if(baseUrl) {
                html = html.replace(/src="\//g, 'src="');
                html = html.replace(/href="\//g, 'href="');
                html = html.replace('<head>', `<head><base href="${baseUrl}"/>`);
            }
            return fs.outputFile(file, html)
        });
    });

    return Promise.all(pages);
}).then(() => {
    return fs.move(assetsDir, path.join(staticDir, './assets'));
}).then(() => {
    if(staticRepo) {
        var parts = staticRepo.split('#');
        var branch = parts[1] || 'master';
        try {
            exec(`cd ${staticDir} && git add . && git commit -m "updated static site"`);
            exec(`cd ${staticDir} && git push origin ${branch}`);
            console.log('Static site successfully built and pushed to remote repository.');
        } catch(e) {
            if(e.cmd && e.cmd.indexOf('git commit')) {
                console.log('Static site successfully built. No changes to push.');
            }
        }
    } else {
        console.log('Static site successfully built. See /static directory.');
    }
}).catch(error => {
    console.error(error);
}).then(() => {
    app.kill();
    process.exit(0);
});