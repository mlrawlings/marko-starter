require('../config');

var path = require('path');
var routes = require('./routes');
var reversePath = require('reverse-path');
var staticDir = path.join(process.cwd(), './.cache/static');
var express = require('express');
var serve = require('serve-static');
var app = express();

app.use('/static', serve(staticDir));

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
            process.send({ event:'online', url:'http://localhost:8080'+path });
        }
    });
}).catch(e => { throw e });