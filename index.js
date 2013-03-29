
/**
 * Module dependencies.
 */

var noop = function() {};

/**
 * List of available commands.
 */

exports.commands = [
    'info'
  , 'help'
  , 'server'
  , 'console'
  , 'generate'
  , 'create'
  , 'remove'
  , 'list'
  , 'new'
  , 'search'
  , 'publish'
];

/**
 * Command aliases.
 *
 * @see http://www.google.com/complete/search?output=toolbar&q=gnerate
 */

exports.aliases = {
    c: 'console'
  , g: 'generate'
  , s: 'server'
  , 'new': 'init'
  , generate: 'create'
};

/**
 * Get command name from an alias.
 */

exports.alias = function(name){
  while (exports.aliases[name])
    name = exports.aliases[name];

  return name;
}

/**
 * Entrance point to running tower commands.
 *
 * @param {Array} argv
 * @api public
 */

exports.run = function(argv){
  var command = argv[2];

  if (!command || command.match(/^-/))
    command = 'info';

  command = exports.alias(command);

  if (!command || !command.match(new RegExp('^' + exports.commands.join('|') + '$')))
    return unknownCommand(command);

  exports[command](argv);
}

/**
 * tower info
 *
 * @api private
 */

exports.info = function(argv){
  console.log([
      'Commands:'
    , 'tower new <app-name>          generate a new Tower application in folder "app-name"'
    , 'tower console                 command line prompt to your application'
    , 'tower generate <generator>    generate project files (models, views, controllers, scaffolds, etc.)'
  ].join("\n"));
};

/**
 * tower new app
 *
 * This just invokes the generator,
 * but shortens the command by using `app` as the generator name.
 *
 * @api private
 */

exports.init = function(argv, fn){
  var recipe = require('tower-recipe');
  // find all the generators on your system.
  recipe.lookup();
  recipe('component' || argv[2]).run(argv.splice(2), fn || noop);
}

/**
 * tower server
 *
 * @api private
 */

exports.server = function(argv) {
  var program = command()
    .usage('server [options]')
    .option('-e, --environment [value]', 'sets Tower.env (development, production, test, etc.)', 'development')
    .option('-p, --port <n>', 'port for the application')
    .option('--static', 'disable-watch')
    .option('--single', 'Single page app')
    .option('-v, --version')
    .on('--help', function(){
      console.log([
          '    Examples:'
        , '      tower generate scaffold Post title:string body:text belongsTo:user'
        , '      tower generate model Post title:string body:text belongsTo:user'
      ].join("\n"));
    }).parse(argv)

  //program.helpIfNecessary()
  
  // TODO: move these onto {Tower.config}

  //Tower.isSinglePage = !!program.single

  program.run = function(){
    /*
    Tower.env   = program.environment || process.env.NODE_ENV || "development"
    process.env.NODE_ENV = Tower.env
    
    if !!program.static # if true
      Tower.watch = false
    else if Tower.env != 'development'
      Tower.watch = false
    else
      Tower.watch = true

    Tower.lazyLoadApp  = Tower.env == 'development'

    # process.env.PORT == heroku, node community convention
    # process.env.port == azure
    # can't use parseInt b/c azure gives you crazy value.
    port = parseInt(program.port) || process.env.PORT || process.env.port || 3000

    Tower.port  = program.port = process.env.PORT = process.env.port = port

    # Tower.isDevelopment, etc.
    Tower["is#{_.camelize(Tower.env)}"] = true
    
    Tower.Application.instance().run()
    */
  }

  return program;
}

/**
 * tower create
 *
 * @api private
 */

exports.create = function(argv, fn){
  require('tower-recipe').create(argv, fn || noop);
}

exports.generate = exports.create;

/**
 * Reverse what the generator did.
 */

exports.remove = function(argv, fn){
  require('tower-recipe').remove(argv, fn || noop);
}

/**
 * XXX: List some resource.
 *
 * @api private
 */

exports.list = function(argv){

}

/**
 * Execute a command from tower's scope.
 *
 * @api private
 */

exports.exec = function(argv){

}

/**
 * Switch between environment config contexts.
 *
 * @api private
 */

exports.use = function(argv){

}

/**
 * Enter interactive console.
 *
 * @api private
 */

exports.console = function(argv){

}

/**
 * Setup local/remote machine as workstation or network.
 *
 * @api private
 */

exports.setup = function(argv){

}

/**
 * Search for components people might have created.
 * @see https://github.com/component/component/blob/master/lib/component.js
 *
 * TODO: One use case for this is to quickly download views/snippets.
 */

exports.search = function(){

}

/**
 * Notify towerjs.org of your component so other people can find it.
 */

exports.publish = function(){

}

/**
 * Tower version.
 */

exports.version = function(){
  return '0.5.0';
}

/**
 * Constructs commander object.
 */

function command() {
  return require('commander').version(exports.version());
}

function unknownCommand(name) {
  // Throw a new error:
  console.error('Command [' + process.argv[2] + '] was not found.');
  process.exit();
}