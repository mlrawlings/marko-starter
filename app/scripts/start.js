var config = require('../config');

if(config.isDev) {
    require('browser-refresh').start({
        script: require.resolve('../server'),
        delay: 3000,
        execArgs: [],
        args: []
    });
} else {
    require('../server');
}