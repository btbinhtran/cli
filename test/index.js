var cli = require('..')
  , assert = require('chai').assert
  , spawn = require('child_process').spawn;

describe('cli', function(){
  it('should alias commands', function(){
    assert.equal('create', cli.alias('create'));
    assert.equal('remove', cli.alias('remove'));
    assert.equal('create', cli.alias('generate'));
    assert.equal('create', cli.alias('g'));
    assert.equal('console', cli.alias('console'));
    assert.equal('console', cli.alias('c'));
    assert.equal('server', cli.alias('server'));
    assert.equal('server', cli.alias('s'));
    assert.equal('init', cli.alias('init'));
    assert.equal('init', cli.alias('new'));
    assert.equal('help', cli.alias('help'));
    assert.equal('info', cli.alias('info'));
  });

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
      tower(['new', 'app1'], function(err, result){
        done();
      })
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
