const _            = require('lodash');
const compose      = require('koa-compose');
const EventEmitter = require('events').EventEmitter;



// inherit EventEmitter.prototype
var proto = Object.create(EventEmitter.prototype);

proto.action = function (name, options) {
  var self = this;

  // accept an function param
  if (typeof options === 'function') {
    options = {
      action: options
    };
  }

  // options, sorted
  options = _.assign({}, {
    before: _noop,
    action: _noop,
    follow: _noop
  }, options);

  this[name] = function *(next) {
    this.controller = self;
    yield compose(_.filter(options, _.isFunction)).call(this, next);
  };
};


/**
 * exports `controllers` module
 */
module.exports = function () {
  return Object.create(proto);
};


/**
 * no operation
 */
function * _noop (next) {
  yield next;
}
