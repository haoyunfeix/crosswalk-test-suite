"use strict"
var emitter = require('events').EventEmitter;
const assert = require('assert');
var module = require('bindings')('realsense_pt');

function inherits(target, source) {
  for (var k in source.prototype) {
    target.prototype[k] = source.prototype[k];
  }
}

inherits(module.Instance, emitter);

describe('check enum LyingPoseRecognitionOptions', function(done){
    it('checking member of LyingPoseRecognitionOptions: '+ "maxTrackedPerson" + "2", function(done) {
      this.timeout(60000);
      var cfg = {
        lying: {

          maxTrackedPerson: 2

        }
      };
      var instance = new module.Instance(cfg);
      instance.start().then(function(){
        console.log('Start camera');
        assert.ok(true);
        done();
      }).catch(function(){
        assert.ok(false);
        done();
      });
    });
});