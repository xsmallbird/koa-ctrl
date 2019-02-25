# koa-ctrl

<!-- [![NPM version][npm-image]][npm-url] -->
[![License][license-image]][license-url]


> koa-ctrl is used to define controller base koa@v2.

## Install

```sh
$ npm i koa-ctrl --save
```

## API

```js
Controller.prototype.action(name, action)
```

## Example

example-1

```js
const controller = new Controller()

controller.action('doHello', async (ctx, next) => {
  ctx.body = 'hello'
  await next()
})

// response.body -> 'hello'
```

example-2

```js
const controller = new Controller()

controller.action('doHello', {
  before: async (ctx, next) => {
    ctx.body = 'before'
    await next()
  },
  action: async (ctx, next) => {
    ctx.body += '->action'
    await next()
  },
  after: async (ctx, next) => {
    ctx.body += '->after'
    await next()
  }
})

// response.body -> 'before->action->after
```

example-3

```js
const controller = new Controller()

controller.action('doHello', {
  before: async (ctx, next) => {
    ctx.body = 'before'
    await next()
  },
  action: async (ctx, next) => {
    ctx.body += '->action'
    await next()
  }
})

// response.body -> 'before->action
```

## Test

```sh
$ npm test (coverage 100%)
```

## License

MIT


[npm-image]: https://img.shields.io/npm/v/koa-ctrl.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-ctrl
[license-image]: http://img.shields.io/npm/l/koa-compose.svg?style=flat-square
[license-url]: LICENSE
