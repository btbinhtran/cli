var cli = require('..')
  , assert = require('chai').assert
  , spawn = require('child_process').spawn;

describe('cli', function(){
  describe('info', function(){
    it('should print info', function(done){
      tower(['info'], function(err, result){
        assert.isNull(err);
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new app', function(done){

    });
  });

  describe('create', function(){
    it('should invoke the generator', function(done){

    });
  });
});

/**
 * Execute a tower command, return output as string.
 */

function tower(args, fn) {
  var child = spawn('./bin/tower', args)
    , result = ''
    , error = '';

  child.stdout.setEncoding('utf-8');
  child.stdout.on('data', function(data){
    result += data;
  });

  child.stderr.setEncoding('utf-8');
  child.stderr.on('data', function(data){
    error += data;
  });

  child.on('close', function(){
    fn(error ? error : null, result);
  });
}
