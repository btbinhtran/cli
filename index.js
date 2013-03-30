
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
  , 'init'
  , 'search'
  , 'publish'
];

/**
 * Verbs to use with recipes.
 */

exports.verbs = [
    'build'
  , 'create'
  , 'remove'
  , 'install'
  , 'uninstall'
  , 'list'
  , 'exec'
]

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
 * Entrance point to running tower commands.
 *
 * @param {Array} argv
 * @api public
 */

exports.run = function(argv){
  var command = argv[2];
  if (!command || command.match(/^-/)) command = 'info';
  command = exports.alias(command);

  if (!command || !command.match(new RegExp('^' + exports.commands.join('|') + '$')))
    return unknownCommand(command);

  return exports[command](argv);
}

/**
 * Get command name from an alias.
 *
 * @param {String} name
 * @api private
 */

exports.alias = function(name){
  while (exports.aliases[name])
    name = exports.aliases[name];

  return name;
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
  // Make sure the application doesn't load yet, it'll throw errors.
  process.exit();
};

/**
 * Create a new app
 *
 * Example:
 *
 *    tower new app
 *
 * This is just a special case of executing a recipe.
 *
 * @api private
 */

exports.init = function(argv, fn){
  require('tower-recipe')
    .lookup()
    .exec('app', 'create', argv, fn || noop);
}

/**
 * tower server
 *
 * @api private
 */

exports.server = function(argv){
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
    }).parse(argv);

  return require('tower-server')(program);
}

/**
 * Ask a recipe to `verb`.
 *
 * @param [Array] argv
 * @param [Function] [fn]
 * @api private
 */

exports.verbs.forEach(function(verb){
  exports[verb] = recipe(verb);
});

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
  require('tower-console')(argv);
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
 *
 * @api private
 */

exports.version = function(){
  return '0.5.0';
}

/**
 * Return a function for executing a recipe's action.
 *
 * @api private
 */

function recipe(verb) {
  return function(argv, fn) {
    // [ 'node', '/usr/local/share/npm/bin/tower', 'create', 'recipe', 'my-recipe', '-o', 'tmp' ]
    require('tower-recipe')
      .lookup()
      .exec(argv[3], verb, argv, fn || noop);
  }
}

/**
 * Constructs commander object.
 *
 * @api private
 */

function command() {
  return require('commander').version(exports.version());
}

/**
 * @api private
 */

function unknownCommand(name) {
  // Throw a new error:
  console.error('Command [' + process.argv[2] + '] was not found.');
  process.exit();
}