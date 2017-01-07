module.exports = function(command, args) {
    switch (command) {
        case 'init':
            require('./init');
            break;
        case 'eject':
            require('./eject');
            break;
        case 'start':
            require('../app/scripts/start');
            break;
        case 'build':
            require('../app/scripts/build');
            break;
        default:
            throw new Error('Unknown command: '+command);
    }
}