module.exports = function() {

    var program = require('commander');
    var commands = require('./commands.js');

    program
        .version(require('./package.json').version)
        .option('s,server,', 'Start the Tower server.')
        .option('t,test', 'Run Tower tests.')
        .option('g,generate', 'Run the generator.')
        .parse(process.argv);

    if (program.server || !process.argv[2]) {
        commands.server();
    } else if (program.test) {
        commands.test();
    } else if (program.generate) {
        commands.generate();
    } else {
        // Throw a new error:
        console.error('Command [' + process.argv[2] + "] was not found.");
        process.exit();
    }

};