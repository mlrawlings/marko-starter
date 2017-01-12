var path = require('path');
var routesTable = require('routes-table');
var routesDir = path.join(process.cwd(), './routes');

var routeOptions = {
    onRoute:(route) => {
        if(route.handler) return route;

        var template = route.template;
        var templatePath;

        if(!template) {
            try {
                templatePath = path.join(route.__dirname, 'index.marko');
                template = require(templatePath);
            } catch(e) {
                if(e.code !== 'MODULE_NOT_FOUND' || !e.message.includes(templatePath)) {
                    throw e;
                }
                throw new Error(
                    'A route must contain a `route.js` file that exports a template ' +
                    'or handler, or the route must contain an `index.marko` file. \n' +
                    'At: ' + route.__dirname
                );
            }
        } else {
            delete route.template;
        }

        route.handler = (req, res) => {
            var data = Object.assign({}, req.params, req.query);
            res.setHeader('content-type', 'text/html; charset=utf-8');
            template.render(data, res);
        };

        return route;
    }
}

exports.get = () => routesTable.build(routesDir, routeOptions);