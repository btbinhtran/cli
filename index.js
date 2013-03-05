module.exports = function() {

    var program = require('commander');
    var commands = require('./cli');

    program
        .version(require('./package.json').version)
        .option('s,server,', 'Start the Tower server.')
        .option('t,test', 'Run Tower tests.')
        .option('g,generate', 'Run the generator.')
        .option('-v', 'Verbose Output.')
        .parse(process.argv);

    var args = process.argv.splice(3);

    if (program.server || !process.argv[2]) {
        commands.server(args);
    } else if (program.test) {
        commands.test(args);
    } else if (program.generate) {
        commands.generate(args);
    } else {
        // Throw a new error:
        console.error('Command [' + process.argv[2] + '] was not found.');
        process.exit();
    }

};