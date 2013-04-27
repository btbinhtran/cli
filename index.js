
/**
 * Module dependencies.
 */

var noop = function() {};

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
  , 'start'
  , 'stop'
  , 'connect'
  , 'enter'
  , 'shutdown'
  , 'describe'
  , 'find'
  , 'save'
];

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
  , 'watch'
].concat(exports.verbs);

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
  , shutdown: 'stop'
};

/**
 * Entrance point to running tower commands.
 *
 * @param {Array} argv
 * @api public
 */

exports.run = function(argv){
  var command = argv[2];
  // Shorten the `node app.js server` call to `node app.js`
  if (argv[1].indexOf('.') !== -1) command = 'server';

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
  argv.splice(2, 1, 'create', 'app');
  require('tower-recipe')
    .lookup()
    .exec('app', 'create', argv, fn || noop);
}

/**
 * XXX: Check if the user is running `tower server` vs `node app.js`. We need to load the `app.js` file
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
  var options = command()
    .usage('console [options]')
    .option('-e, --env [value]', 'sets Tower.env (development, production, test, etc., default: development)', 'development')
    .option('-s, --sync', 'allows for database operations to run synchronously, via node fibers')
    // .option('-r, --remote')

  require('tower-console')({
      env: options.env
    , sync: !!options.sync
  });
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

exports.watch = function(){
  require('tower-fs').watch(process.cwd());
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
    // TODO: so you can do `tower <verb> .` and have it <verb> the recipe you are currently in.
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