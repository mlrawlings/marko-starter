require('browser-refresh').start({
    script: require.resolve('../app/index.js'),
    delay: 3000,
    execArgs: [],
    args: []
});