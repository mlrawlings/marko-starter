var path = require('path');
var routesTable = require('routes-table');
var pagesDir = path.join(process.cwd(), './src/pages');

var routeOptions = {
    onRoute:(module, directory, route) => {
        if(typeof module.render === 'function') {
            route.handler = (req, res) => {
                var data = Object.assign({}, req.params, req.query);
                res.setHeader('content-type', 'text/html; charset=utf-8');
                module.render(data, res);
            };
        }

        return route;
    }
}

exports.get = () => routesTable.build(pagesDir, routeOptions);