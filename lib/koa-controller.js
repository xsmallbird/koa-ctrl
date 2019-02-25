/*
 * @Author: xsmallbird
 * @Description:
 * @Date: 2019-02-25 21:26:01
 * @Last Modified by: xsmallbird@gmail.com
 */

const compose = require('koa-compose')
const EventEmitter = require('events').EventEmitter

// Inherit EventEmitter.prototype
var prototype = Object.create(EventEmitter.prototype)

const LIST = ['before', 'action', 'follow']

prototype.action = function (name, options) {
  let middlewares = []

  // Accept An Function Param
  if (typeof options === 'function') {
    options = { action: options }
  }

  options = Object.assign({}, {
    before: noop,
    action: noop,
    follow: noop
  }, options) // Options, Sorted

  LIST.forEach(function (item) {
    if (isFunction(options[item])) {
      middlewares.push(options[item])
    }
  })

  let self = this

  this[name] = async function (ctx, next) {
    this.controller = self

    await compose(middlewares)(ctx, next)
  }
}

// Exports module
module.exports = function () {
  return Object.create(prototype)
}

// No operation function
async function noop (ctx, next) {
  await next()
}

// Check value is `Function`
function isFunction (value) {
  return typeof value === 'function'
}
