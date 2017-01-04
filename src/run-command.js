module.exports = function(command, args) {
    switch (command) {
        case 'init':
            require('./init');
            break;
        case 'build':
            require('./build');
            break;
        case 'start':
            require('./start');
            break;
        case 'eject':
            require('./eject');
            break;
        default:
            throw new Error('Unknown command: '+command);
    }
}