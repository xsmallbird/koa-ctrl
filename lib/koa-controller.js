/*
 * @Author: xsmallbird
 * @Description:
 * @Date: 2019-02-25 21:26:01
 * @Last Modified by: xsmallbird@gmail.com
 */

const assert = require('assert')
const compose = require('koa-compose')
const EventEmitter = require('events').EventEmitter

// Inherit EventEmitter.prototype
var prototype = Object.create(EventEmitter.prototype)

const LIST = ['before', 'action', 'after']

prototype.action = function (name, action) {
  let middlewares = []

  assert(name, 'missing controller name')
  assert(action, 'missing executable action')

  // Accept An Function Param
  if (typeof action === 'function') {
    action = { action: action }
  }

  action = Object.assign({}, {
    before: noop,
    action: noop,
    after: noop
  }, action) // option, Sorted

  LIST.forEach(function (item) {
    if (isFunction(action[item])) {
      middlewares.push(action[item])
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
