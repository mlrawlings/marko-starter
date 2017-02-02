var config = require('../config');
var path = require('path');
var routes = require('./routes');
var reversePath = require('reverse-path');
var assetsDir = path.join(process.cwd(), './.cache/assets');
var express = require('express');
var serve = require('serve-static');

var app = express();

app.use('/assets', serve(assetsDir, {
    maxAge: config.isProd ? 365 * 24 * 60 * 60 : 0
}));

routes.get().then(routes => {
    if(!routes.length) {
        throw new Error('No routes found!');
    }

    routes.forEach(route => {
        app[route.method || 'get'](route.path, route.handler);
    });


    app.listen(8080, () => {
        if(process.send) {
            var path = reversePath(routes[0].path, routes[0].params[0]);
            process.send({
                event: 'online',
                url: 'http://localhost:8080' + path
            });
        }
    });
}).catch(e => { console.error(e); });
