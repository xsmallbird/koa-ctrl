const compose      = require('koa-compose');
const EventEmitter = require('events').EventEmitter;



const LIST = ['before', 'action', 'follow'];

// Inherit EventEmitter.prototype
var proto = Object.create(EventEmitter.prototype);

proto.action = function (name, options) {
  var middlewares = [], self = this;

  // Accept An Function Param
  if (typeof options === 'function') {
    options = { action: options };
  }

  options = Object.assign({}, {
    before: noop,
    action: noop,
    follow: noop
  }, options); // Options, Sorted

  LIST.forEach(function (item) {
    if (isFunction(options[item])) {
      middlewares.push(options[item]);
    }
  });

  this[name] = function *(next) {
    this.controller = self;
    yield compose(middlewares).call(this, next);
  };
};


proto.act = proto.action; // Action Rename


// Exports module
module.exports = function () {
  return Object.create(proto);
};

// No operation function
function * noop (next) { yield next; }

// Check value is `Function`
function isFunction (value) {
  return typeof value === 'function';
}
