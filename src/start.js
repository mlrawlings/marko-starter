var NODE_ENV = process.env.NODE_ENV;
var isDev = NODE_ENV == null ||
            NODE_ENV.toLowerCase() === 'development'.slice(0, NODE_ENV.length);

if(isDev) {
    require('browser-refresh').start({
        script: require.resolve('../app/index.js'),
        delay: 3000,
        execArgs: [],
        args: []
    });
} else {
    require('../app/index.js');
}